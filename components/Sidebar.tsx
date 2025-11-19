import React from 'react';
import { View } from '../types';
import { LayoutDashboard, ShieldAlert, MessageSquareHeart, Activity, Menu, X, Users } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.ACTIVITY, label: 'Activity Log', icon: Activity },
    { id: View.ANALYZER, label: 'Safety Scanner', icon: ShieldAlert },
    { id: View.ADVISOR, label: 'Parent Advisor', icon: MessageSquareHeart },
    { id: View.PROFILES, label: 'Family Profiles', icon: Users },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white rounded-md shadow-md text-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 shadow-xl`}
      >
        <div className="flex items-center justify-center h-20 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="text-emerald-400" size={28} />
            <h1 className="text-xl font-bold tracking-wider">GuardianAI</h1>
          </div>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                currentView === item.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="mr-3" size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-2">Premium Plan Active</p>
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};