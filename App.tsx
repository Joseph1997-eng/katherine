import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ContentAnalyzer } from './components/ContentAnalyzer';
import { Advisor } from './components/Advisor';
import { ActivityLog } from './components/ActivityLog';
import { Profiles } from './components/Profiles';
import { View, ChildProfile } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lifted state for children profiles
  const [children, setChildren] = useState<ChildProfile[]>([
    {
      id: '1',
      name: 'Alex',
      dob: '2012-05-15', // Approx 12 years old
      avatarColor: 'bg-blue-500',
      dailyLimit: 180,
      bedtime: '21:00',
      restrictedCategories: ['Adult Content', 'Gambling']
    },
    {
      id: '2',
      name: 'Mia',
      dob: '2016-08-20', // Approx 8 years old
      avatarColor: 'bg-pink-500',
      dailyLimit: 120,
      bedtime: '20:00',
      restrictedCategories: ['Adult Content', 'Social Media', 'Violence']
    }
  ]);

  const [selectedChildId, setSelectedChildId] = useState<string>(children[0]?.id || '');

  // Ensure selectedChildId is valid if children list changes
  useEffect(() => {
    if (children.length > 0 && !children.find(c => c.id === selectedChildId)) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard 
          childrenProfiles={children} 
          selectedChildId={selectedChildId} 
          setSelectedChildId={setSelectedChildId} 
        />;
      case View.ANALYZER:
        return <ContentAnalyzer />;
      case View.ADVISOR:
        return <Advisor />;
      case View.ACTIVITY:
        return <ActivityLog 
          childrenProfiles={children} 
          selectedChildId={selectedChildId} 
          setSelectedChildId={setSelectedChildId}
        />;
      case View.PROFILES:
        return <Profiles childProfiles={children} setChildProfiles={setChildren} />;
      default:
        return <Dashboard 
          childrenProfiles={children} 
          selectedChildId={selectedChildId} 
          setSelectedChildId={setSelectedChildId} 
        />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}