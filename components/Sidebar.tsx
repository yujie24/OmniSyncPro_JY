
import React from 'react';
import { Calendar, FileText, Book, Layout as BoardIcon, Share2, Search, Settings, Cloud, ChevronRight } from 'lucide-react';
import { AppView, User } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, user }) => {
  const menuItems = [
    { id: 'Calendar', icon: Calendar, label: 'Calendar', color: 'text-red-500' },
    { id: 'Notes', icon: FileText, label: 'Notes', color: 'text-yellow-500' },
    { id: 'Journal', icon: Book, label: 'Journal', color: 'text-green-500' },
    { id: 'Projects', icon: BoardIcon, label: 'Projects', color: 'text-blue-500' },
    { id: 'Links', icon: Share2, label: 'Links', color: 'text-purple-500' },
  ];

  const hasBg = !!user.settings.backgroundImage;

  return (
    <div className={`w-64 h-full flex flex-col border-r border-[#D1D1D6] p-4 hidden md:flex transition-all duration-500 ${hasBg ? 'bg-white/10 backdrop-blur-xl' : 'bg-[#E5E5EA]'}`}>
      {/* Window Controls */}
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-sm"></div>
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm"></div>
        <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-sm"></div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search" 
          className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 transition-colors ${hasBg ? 'bg-white/20' : 'bg-[#D1D1D6]'}`}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as AppView)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
              currentView === item.id 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'hover:bg-white/20 text-[#1C1C1E]'
            }`}
          >
            <item.icon className={`h-5 w-5 ${currentView === item.id ? 'text-white' : item.color}`} />
            <span className="text-sm font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* iCloud User Account Footer */}
      <div className={`mt-4 pt-4 border-t border-[#D1D1D6] ${hasBg ? 'border-white/10' : ''}`}>
        <div className="flex items-center gap-2 px-2 mb-2">
          <div className="flex items-center gap-1.5 bg-blue-50/50 px-2 py-0.5 rounded-full border border-blue-100">
            <Cloud className="h-3 w-3 text-blue-500" />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Syncing All Devices</span>
          </div>
        </div>
        
        <button className="w-full group flex items-center justify-between p-2 rounded-xl hover:bg-white/40 transition-colors text-left">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={user.avatar} 
                className="w-10 h-10 rounded-full border border-white bg-white shadow-sm" 
                alt="avatar" 
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-[#1C1C1E] truncate">{user.name}</h4>
              <p className="text-[10px] text-gray-500 truncate">iPhone & Mac Pro</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>

        <div className="flex items-center justify-between mt-4 px-2">
           <span className="text-[9px] text-gray-400 font-medium">Auto-Syncing</span>
           <Settings 
              onClick={() => setView('Settings')}
              className={`h-4 w-4 cursor-pointer hover:text-gray-800 transition-colors ${currentView === 'Settings' ? 'text-blue-600' : 'text-gray-400'}`} 
           />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
