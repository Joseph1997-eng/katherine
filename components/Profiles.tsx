import React, { useState, useRef } from 'react';
import { User, Mail, Bell, Shield, Clock, Smartphone, Plus, Save, Trash2, Moon, Laptop, Sparkles, Info, Calendar, Check } from 'lucide-react';
import { ChildProfile } from '../types';

interface ParentProfile {
  name: string;
  email: string;
  notifications: boolean;
  pushNotifications: boolean;
  reportFrequency: 'Daily' | 'Weekly';
}

interface ProfilesProps {
  childProfiles: ChildProfile[];
  setChildProfiles: React.Dispatch<React.SetStateAction<ChildProfile[]>>;
}

export const Profiles: React.FC<ProfilesProps> = ({ childProfiles, setChildProfiles }) => {
  const [activeTab, setActiveTab] = useState<'parent' | 'children'>('children');
  
  const [parentProfile, setParentProfile] = useState<ParentProfile>({
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    notifications: true,
    pushNotifications: false,
    reportFrequency: 'Weekly'
  });

  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Use ReturnType<typeof setTimeout> to handle both browser (number) and Node (Timeout object) environments without relying on NodeJS namespace
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveParent = () => {
    // Simulate API call
    showToast('Parent profile settings saved successfully!');
  };

  const updateChild = (id: string, updates: Partial<ChildProfile>) => {
    setChildProfiles(childProfiles.map(child => child.id === id ? { ...child, ...updates } : child));
  };

  const toggleCategory = (childId: string, category: string) => {
    const child = childProfiles.find(c => c.id === childId);
    if (!child) return;

    const newCategories = child.restrictedCategories.includes(category)
      ? child.restrictedCategories.filter(c => c !== category)
      : [...child.restrictedCategories, category];
    
    updateChild(childId, { restrictedCategories: newCategories });
  };

  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  // Helper to get age-based recommendations
  const getAgeGuidelines = (age: number) => {
    if (age < 6) {
      return {
        label: 'Preschool Safety Mode',
        limit: 60,
        bedtime: '19:30',
        restrictions: ['Social Media', 'Games', 'Adult Content', 'Violence', 'Gambling', 'Shopping'],
        description: 'Strict restrictions recommended. No social media or unmoderated games.'
      };
    } else if (age < 13) {
      return {
        label: 'School-Age Balanced Mode',
        limit: 120,
        bedtime: '21:00',
        restrictions: ['Adult Content', 'Violence', 'Gambling', 'Social Media'],
        description: 'Moderate limits. Social media restricted by default.'
      };
    } else {
      return {
        label: 'Teen Trust Mode',
        limit: 240,
        bedtime: '22:30',
        restrictions: ['Adult Content', 'Gambling'],
        description: 'More freedom, focusing on filtering adult content and gambling.'
      };
    }
  };

  const applyRecommendations = (childId: string, age: number) => {
    const guide = getAgeGuidelines(age);
    updateChild(childId, {
      dailyLimit: guide.limit,
      bedtime: guide.bedtime,
      restrictedCategories: guide.restrictions
    });
    showToast(`Settings updated for ${age}-year-old guidelines.`);
  };

  const handleAddChild = () => {
    const colors = ['bg-blue-500', 'bg-pink-500', 'bg-purple-500', 'bg-emerald-500', 'bg-orange-500', 'bg-cyan-500', 'bg-rose-500', 'bg-indigo-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Default to 10 years ago
    const today = new Date();
    const defaultYear = today.getFullYear() - 10;
    const defaultDob = `${defaultYear}-01-01`;
    const guide = getAgeGuidelines(10);
    
    const newChild: ChildProfile = {
      id: Date.now().toString(),
      name: 'New Child',
      dob: defaultDob,
      avatarColor: randomColor,
      dailyLimit: guide.limit,
      bedtime: guide.bedtime,
      restrictedCategories: guide.restrictions
    };

    setChildProfiles([...childProfiles, newChild]);
    setEditingChildId(newChild.id);
    showToast('New profile added!');
  };

  const handleDeleteChild = (id: string) => {
    if (window.confirm('Are you sure you want to remove this profile?')) {
      const newChildren = childProfiles.filter(c => c.id !== id);
      setChildProfiles(newChildren);
      if (editingChildId === id) setEditingChildId(null);
      showToast('Profile removed.');
    }
  };

  const availableCategories = ['Social Media', 'Games', 'Adult Content', 'Violence', 'Gambling', 'Shopping'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      <header>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Family Profiles</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage account settings and child safety controls.</p>
      </header>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('children')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'children'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Child Profiles
        </button>
        <button
          onClick={() => setActiveTab('parent')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'parent'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Parent Settings
        </button>
      </div>

      {/* Content */}
      {activeTab === 'parent' ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <User size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Parent Account</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Primary Guardian</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={parentProfile.name}
                  onChange={(e) => setParentProfile({...parentProfile, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email" 
                  value={parentProfile.email}
                  onChange={(e) => setParentProfile({...parentProfile, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 border-t border-slate-100 dark:border-slate-700 pt-6">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell size={18} className="text-emerald-500" /> Notifications
            </h4>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">Real-time Email Alerts</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Get notified via email about flagged content.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={parentProfile.notifications} 
                  onChange={(e) => setParentProfile({...parentProfile, notifications: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">Push Notifications</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Receive instant alerts on your device.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={parentProfile.pushNotifications} 
                  onChange={(e) => setParentProfile({...parentProfile, pushNotifications: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">Activity Reports</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">How often to receive summary emails.</p>
              </div>
              <select 
                value={parentProfile.reportFrequency}
                onChange={(e) => setParentProfile({...parentProfile, reportFrequency: e.target.value as any})}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"
              >
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleSaveParent}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg shadow-md transition-all font-medium"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {childProfiles.map((child) => {
            const currentAge = calculateAge(child.dob);
            return (
            <div key={child.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
              {/* Child Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 ${child.avatarColor} rounded-2xl flex items-center justify-center text-white shadow-md`}>
                    <span className="text-2xl font-bold">{child.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {child.name}
                      <span className="text-xs font-normal bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">Age {currentAge}</span>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <Shield size={14} className="text-emerald-500" />
                      {child.restrictedCategories.length} Categories Restricted
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setEditingChildId(editingChildId === child.id ? null : child.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    editingChildId === child.id 
                      ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {editingChildId === child.id ? 'Close Settings' : 'Manage Settings'}
                </button>
              </div>

              {/* Expanded Settings */}
              {editingChildId === child.id && (
                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/30 animate-fade-in space-y-8">
                  
                  {/* Profile Basics Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Child Name</label>
                      <input
                        type="text"
                        value={child.name}
                        onChange={(e) => updateChild(child.id, { name: e.target.value })}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date of Birth</label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="date"
                          value={child.dob}
                          onChange={(e) => updateChild(child.id, { dob: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendations Banner */}
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
                    <div className="flex gap-4">
                      <div className="mt-1 p-2 bg-indigo-100 dark:bg-indigo-800 rounded-full h-fit text-indigo-600 dark:text-indigo-300">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-base">
                          Recommended for Age {currentAge}: {getAgeGuidelines(currentAge).label}
                        </h4>
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1 leading-relaxed max-w-xl">
                          {getAgeGuidelines(currentAge).description}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => applyRecommendations(child.id, currentAge)}
                      className="shrink-0 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all hover:shadow-md whitespace-nowrap"
                    >
                      Apply Settings
                    </button>
                  </div>

                  {/* Time Limits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                       <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                         <Clock size={18} className="text-blue-500" /> Daily Screen Time
                       </h4>
                       <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                              {Math.floor(child.dailyLimit / 60)}h {child.dailyLimit % 60}m
                            </span>
                            <span className="text-xs text-slate-500 uppercase font-medium tracking-wider">Max Duration</span>
                         </div>
                         <input 
                           type="range" 
                           min="30" 
                           max="480" 
                           step="30"
                           value={child.dailyLimit}
                           onChange={(e) => updateChild(child.id, { dailyLimit: parseInt(e.target.value) })}
                           className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                         />
                         <div className="flex justify-between text-xs text-slate-400">
                            <span>30m</span>
                            <span>8h</span>
                         </div>
                       </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                       <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                         <Moon size={18} className="text-indigo-500" /> Bedtime Schedule
                       </h4>
                       <div className="space-y-2">
                         <label className="text-sm text-slate-500 dark:text-slate-400">Device locks automatically at:</label>
                         <input 
                           type="time" 
                           value={child.bedtime}
                           onChange={(e) => updateChild(child.id, { bedtime: e.target.value })}
                           className="block w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                         />
                       </div>
                    </div>
                  </div>

                  {/* Content Restrictions */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                        <Shield size={18} className="text-red-500" /> Content Restrictions
                      </h4>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                         <Info size={12} /> Click to toggle
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {availableCategories.map(cat => {
                        const isBlocked = child.restrictedCategories.includes(cat);
                        return (
                          <button
                            key={cat}
                            onClick={() => toggleCategory(child.id, cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${
                              isBlocked
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700'
                            }`}
                          >
                            {isBlocked ? <Shield size={14} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-slate-500" />}
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Device List (Mock) */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Smartphone size={18} className="text-slate-500" /> Active Devices
                    </h4>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg">
                        <Smartphone size={20} className="text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">iPhone 13</p>
                          <p className="text-xs text-emerald-500">Active now</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg">
                        <Laptop size={20} className="text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">MacBook Air</p>
                          <p className="text-xs text-slate-400">Last seen 2h ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                   {/* Delete Button */}
                   <div className="border-t border-slate-200 dark:border-slate-700 pt-6 flex justify-end">
                      <button 
                        onClick={() => handleDeleteChild(child.id)}
                        className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Trash2 size={18} /> Remove Profile
                      </button>
                   </div>

                </div>
              )}
            </div>
            );
          })}

          {/* Add Child Button */}
          <button 
            onClick={handleAddChild}
            className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-emerald-400 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add Another Child Profile
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 dark:border-slate-200 animate-bounce-in">
                <div className="bg-emerald-500 rounded-full p-1">
                    <Check size={16} className="text-white" strokeWidth={3} />
                </div>
                <span className="font-medium">{toastMessage}</span>
            </div>
        </div>
      )}
    </div>
  );
};