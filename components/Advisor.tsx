import React, { useState, useEffect, useRef } from 'react';
import { createAdvisorChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, User, Bot, MoreHorizontal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const Advisor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm GuardianAI, your parenting assistant. How can I help you keep your family safe online today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = createAdvisorChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createAdvisorChat();
      }

      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullResponse = "";
      const modelMsgId = (Date.now() + 1).toString();
      
      // Optimistic update for stream start
      setMessages((prev) => [
        ...prev,
        {
          id: modelMsgId,
          role: 'model',
          text: '',
          timestamp: new Date(),
        },
      ]);

      for await (const chunk of result) {
        const chunkText = chunk.text(); // Helper from SDK, or use chunk.text
        fullResponse += chunkText;
        
        setMessages((prev) => 
            prev.map(msg => 
                msg.id === modelMsgId ? { ...msg, text: fullResponse } : msg
            )
        );
      }
      
    } catch (error) {
      console.error("Chat error", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Bot className="text-emerald-600" size={20} />
            Parenting Advisor
          </h2>
          <p className="text-xs text-slate-500">AI-powered guidance for digital safety</p>
        </div>
        <div className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
          Online
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
              }`}
            >
              {msg.role === 'model' ? (
                 <div className="prose prose-sm prose-slate max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                 </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
             <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                <MoreHorizontal className="text-slate-400 animate-pulse" size={20} />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex-1 bg-slate-100 rounded-xl p-1 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:bg-white transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about screen time limits, app safety, etc..."
              className="w-full bg-transparent border-none focus:ring-0 resize-none text-slate-800 placeholder-slate-400 p-3 max-h-32 min-h-[50px] outline-none"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl transition-all ${
              !input.trim() || isLoading
                ? 'bg-slate-200 text-slate-400'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">AI can make mistakes. Verify important information.</p>
        </div>
      </div>
    </div>
  );
};
