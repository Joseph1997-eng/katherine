import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ContentAnalyzer } from './components/ContentAnalyzer';
import { Advisor } from './components/Advisor';
import { ActivityLog } from './components/ActivityLog';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.ANALYZER:
        return <ContentAnalyzer />;
      case View.ADVISOR:
        return <Advisor />;
      case View.ACTIVITY:
        return <ActivityLog />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
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
