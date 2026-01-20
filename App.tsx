
import React, { useState, useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { AppView } from './types';
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';
import NotesView from './components/NotesView';
import ProjectBoard from './components/ProjectBoard';
import LinkHub from './components/LinkHub';
import SettingsView from './components/SettingsView';
import { Menu, X, Cloud } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('Calendar');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const store = useAppStore();

  useEffect(() => {
    // Check if running as a PWA (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsPWA(!!isStandalone);
  }, []);

  const hasBackground = !!store.user.settings.backgroundImage;

  const renderView = () => {
    switch (currentView) {
      case 'Calendar':
        return <CalendarView events={store.events} onAddEvent={store.addEvent} />;
      case 'Notes':
        return <NotesView notes={store.notes} onAddNote={store.addNote} onUpdateNote={store.updateNote} />;
      case 'Projects':
        return <ProjectBoard tasks={store.tasks} onAddTask={store.addTask} onUpdateTask={store.updateTask} />;
      case 'Links':
        return <LinkHub links={store.links} onAdd={store.addLink} />;
      case 'Settings':
        return <SettingsView />;
      case 'Journal':
        return (
          <div className="p-20 text-center">
            <h1 className="text-4xl font-bold mb-4">Journal</h1>
            <p className="text-gray-500 italic">"Write down your thoughts, preserve the moments..."</p>
            <div className="mt-10 max-w-2xl mx-auto p-10 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl">
               <p className="text-gray-600">Journal feature coming in next iteration with full rich text support.</p>
            </div>
          </div>
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className={`relative flex h-screen bg-[#F2F2F7] overflow-hidden ${isPWA ? 'pwa-mode' : ''}`}>
      {/* Dynamic Background Image */}
      {hasBackground && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
          style={{ backgroundImage: `url(${store.user.settings.backgroundImage})` }}
        />
      )}

      {/* Content Wrapper with Glass Overlay */}
      <div className={`relative z-10 flex w-full h-full transition-all duration-500 ${hasBackground ? 'bg-white/10' : ''}`} style={{ backdropFilter: hasBackground ? `blur(${store.user.settings.blurAmount}px)` : 'none' }}>
        {/* Sidebar - Desktop */}
        <Sidebar 
          currentView={currentView} 
          setView={setCurrentView} 
          user={store.user} 
        />

        {/* Mobile Nav Header */}
        <div className={`md:hidden fixed top-0 left-0 right-0 h-16 glass flex items-center justify-between px-6 z-50 ${isPWA ? 'pt-8 h-20' : ''}`}>
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-500" />
            <span className="font-bold text-lg">{currentView}</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl md:hidden pt-24 overflow-y-auto">
            <div className="flex flex-col gap-6 p-10">
              {['Calendar', 'Notes', 'Journal', 'Projects', 'Links', 'Settings'].map((v) => (
                <button
                  key={v}
                  onClick={() => { setCurrentView(v as AppView); setMobileMenuOpen(false); }}
                  className={`text-2xl font-bold text-left ${currentView === v ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  {v}
                </button>
              ))}
              <div className="mt-10 pt-10 border-t border-gray-100">
                <div className="flex items-center gap-4">
                    <img src={store.user.avatar} className="w-12 h-12 rounded-full border border-gray-200" alt="avatar" />
                    <div>
                      <p className="font-bold">{store.user.name}</p>
                      <p className="text-sm text-gray-500">{store.user.email}</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 h-full overflow-hidden transition-all ${isPWA ? 'pt-20' : 'pt-16'} md:pt-0 ${hasBackground ? 'bg-transparent' : ''}`}>
          <div className="h-full w-full max-w-[1400px] mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
