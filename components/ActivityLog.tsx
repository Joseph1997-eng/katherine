import React, { useState } from 'react';
import { ActivityItem, ChildProfile } from '../types';
import { summarizeActivity } from '../services/geminiService';
import { Smartphone, Globe, Gamepad2, Clock, Sparkles, Play, ChevronDown } from 'lucide-react';

interface ActivityLogProps {
  childrenProfiles: ChildProfile[];
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: '1', app: 'Roblox', duration: 120, timestamp: '2023-10-27T10:00:00', category: 'Game', flagged: false },
  { id: '2', app: 'TikTok', duration: 45, timestamp: '2023-10-27T12:30:00', category: 'Social', flagged: true },
  { id: '3', app: 'Wikipedia', duration: 30, timestamp: '2023-10-27T14:15:00', category: 'Education', flagged: false },
  { id: '4', app: 'Minecraft', duration: 90, timestamp: '2023-10-27T16:00:00', category: 'Game', flagged: false },
  { id: '5', app: 'Unknown Browser Site', duration: 10, timestamp: '2023-10-27T18:20:00', category: 'Utility', flagged: true },
  { id: '6', app: 'YouTube Kids', duration: 60, timestamp: '2023-10-27T19:00:00', category: 'Entertainment', flagged: false },
];

export const ActivityLog: React.FC<ActivityLogProps> = ({ childrenProfiles, selectedChildId, setSelectedChildId }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  
  const selectedChild = childrenProfiles.find(c => c.id === selectedChildId) || childrenProfiles[0];

  const handleSummarize = async () => {
    setLoadingSummary(true);
    const text = await summarizeActivity(MOCK_ACTIVITIES);
    setSummary(text);
    setLoadingSummary(false);
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'Game': return <Gamepad2 size={18} className="text-purple-500 dark:text-purple-400" />;
      case 'Social': return <Smartphone size={18} className="text-pink-500 dark:text-pink-400" />;
      case 'Education': return <Globe size={18} className="text-blue-500 dark:text-blue-400" />;
      case 'Entertainment': return <Play size={18} className="text-red-500 dark:text-red-400" />;
      default: return <Globe size={18} className="text-slate-500 dark:text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center w-full sm:w-auto">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Activity Log</h2>
            <p className="text-slate-500 dark:text-slate-400">Detailed view of recent app usage.</p>
          </div>
          
           {/* Child Selector */}
           {childrenProfiles.length > 0 && (
            <div className="relative inline-block mt-2 sm:mt-0">
              <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 shadow-sm">
                <div className={`w-6 h-6 rounded-full ${selectedChild?.avatarColor || 'bg-slate-400'} flex items-center justify-center text-white text-xs font-bold`}>
                  {selectedChild?.name?.charAt(0) || '?'}
                </div>
                <select 
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 dark:text-white outline-none cursor-pointer appearance-none pr-6"
                >
                  {childrenProfiles.map(child => (
                    <option key={child.id} value={child.id} className="text-slate-900 dark:text-white bg-white dark:bg-slate-800">
                      {child.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSummarize}
          disabled={loadingSummary}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md transition-all disabled:opacity-70 whitespace-nowrap w-full sm:w-auto"
        >
          {loadingSummary ? (
             <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <Sparkles size={18} />
          )}
          <span>{loadingSummary ? 'Generating...' : 'Summarize'}</span>
        </button>
      </header>

      {summary && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800 p-6 rounded-xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={100} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-indigo-900 dark:text-indigo-200 font-bold flex items-center gap-2 mb-2">
                <Sparkles size={20} /> Daily Insight for {selectedChild?.name}
            </h3>
            <p className="text-indigo-800 dark:text-indigo-300 leading-relaxed">{summary}</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">App / Site</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {MOCK_ACTIVITIES.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{item.app}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                      {getIcon(item.category)}
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Clock size={14} />
                    {item.duration} min
                  </td>
                  <td className="px-6 py-4">
                    {item.flagged ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
                        Flagged
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Safe
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-500 text-sm">
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
