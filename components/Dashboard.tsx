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
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

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

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Weekly Overview</h2>
        <p className="text-slate-500">Summary of digital activity for Child Account: <span className="font-medium text-slate-700">Alex</span></p>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Avg. Screen Time</p>
            <h3 className="text-2xl font-bold text-slate-800">4h 12m</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Safe Content Rate</p>
            <h3 className="text-2xl font-bold text-slate-800">98.5%</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 rounded-full text-amber-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Alerts (This Week)</p>
            <h3 className="text-2xl font-bold text-slate-800">3</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Daily Screen Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Category Breakdown</h3>
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {APP_USAGE_DATA.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-sm text-slate-600">
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
