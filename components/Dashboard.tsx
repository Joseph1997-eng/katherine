import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Clock, AlertTriangle, CheckCircle, Users, ChevronDown } from 'lucide-react';
import { ChildProfile } from '../types';

interface DashboardProps {
  childrenProfiles: ChildProfile[];
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
}

const WEEKLY_DATA = [
  { name: 'Mon', hours: 3.5 },
  { name: 'Tue', hours: 4.2 },
  { name: 'Wed', hours: 2.8 },
  { name: 'Thu', hours: 5.1 },
  { name: 'Fri', hours: 3.9 },
  { name: 'Sat', hours: 6.5 },
  { name: 'Sun', hours: 5.8 },
];

const APP_USAGE_DATA = [
  { name: 'Social', value: 45 },
  { name: 'Games', value: 30 },
  { name: 'Education', value: 15 },
  { name: 'Other', value: 10 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#64748b'];

export const Dashboard: React.FC<DashboardProps> = ({ childrenProfiles, selectedChildId, setSelectedChildId }) => {
  const selectedChild = childrenProfiles.find(c => c.id === selectedChildId) || childrenProfiles[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Weekly Overview</h2>
          <p className="text-slate-500 dark:text-slate-400">Summary of digital activity</p>
        </div>
        
        {/* Child Selector */}
        {childrenProfiles.length > 0 && (
          <div className="relative inline-block">
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
                    {child.name}'s Dashboard
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4 transition-colors">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Screen Time</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">4h 12m</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4 transition-colors">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Safe Content Rate</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">98.5%</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4 transition-colors">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Alerts (This Week)</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">3</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Daily Screen Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#334155', 
                    color: '#f8fafc',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Category Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={APP_USAGE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {APP_USAGE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderColor: '#334155', 
                    color: '#f8fafc',
                    borderRadius: '8px'
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {APP_USAGE_DATA.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
