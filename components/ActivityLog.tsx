import React, { useState } from 'react';
import { ActivityItem } from '../types';
import { summarizeActivity } from '../services/geminiService';
import { Smartphone, Globe, Gamepad2, Clock, Sparkles, Play } from 'lucide-react';

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: '1', app: 'Roblox', duration: 120, timestamp: '2023-10-27T10:00:00', category: 'Game', flagged: false },
  { id: '2', app: 'TikTok', duration: 45, timestamp: '2023-10-27T12:30:00', category: 'Social', flagged: true },
  { id: '3', app: 'Wikipedia', duration: 30, timestamp: '2023-10-27T14:15:00', category: 'Education', flagged: false },
  { id: '4', app: 'Minecraft', duration: 90, timestamp: '2023-10-27T16:00:00', category: 'Game', flagged: false },
  { id: '5', app: 'Unknown Browser Site', duration: 10, timestamp: '2023-10-27T18:20:00', category: 'Utility', flagged: true },
  { id: '6', app: 'YouTube Kids', duration: 60, timestamp: '2023-10-27T19:00:00', category: 'Entertainment', flagged: false },
];

export const ActivityLog: React.FC = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleSummarize = async () => {
    setLoadingSummary(true);
    const text = await summarizeActivity(MOCK_ACTIVITIES);
    setSummary(text);
    setLoadingSummary(false);
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'Game': return <Gamepad2 size={18} className="text-purple-500" />;
      case 'Social': return <Smartphone size={18} className="text-pink-500" />;
      case 'Education': return <Globe size={18} className="text-blue-500" />;
      case 'Entertainment': return <Play size={18} className="text-red-500" />;
      default: return <Globe size={18} className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Activity Log</h2>
          <p className="text-slate-500">Detailed view of recent app usage and web visits.</p>
        </div>
        <button
          onClick={handleSummarize}
          disabled={loadingSummary}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all disabled:opacity-70"
        >
          {loadingSummary ? (
             <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <Sparkles size={18} />
          )}
          <span>{loadingSummary ? 'Generating Insights...' : 'Summarize with AI'}</span>
        </button>
      </header>

      {summary && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-6 rounded-xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={100} className="text-indigo-600" />
            </div>
            <h3 className="text-indigo-900 font-bold flex items-center gap-2 mb-2">
                <Sparkles size={20} /> Daily Insight
            </h3>
            <p className="text-indigo-800 leading-relaxed">{summary}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">App / Site</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ACTIVITIES.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.app}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {getIcon(item.category)}
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 flex items-center gap-1">
                    <Clock size={14} />
                    {item.duration} min
                  </td>
                  <td className="px-6 py-4">
                    {item.flagged ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        Flagged
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Safe
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
