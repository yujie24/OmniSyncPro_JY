
import React, { useState, useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { AppView } from './types';
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';
import NotesView from './components/NotesView';
import ProjectBoard from './components/ProjectBoard';
import LinkHub from './components/LinkHub';
import SettingsView from './components/SettingsView';
import JournalView from './components/JournalView';
import { Menu, X, Cloud, RefreshCw, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('Calendar');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const store = useAppStore();

  useEffect(() => {
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
      case 'Journal':
        return <JournalView entries={store.journal} onAdd={store.addJournal} />;
      case 'Settings':
        return <SettingsView />;
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

      {/* Sync Status Overlay (Small HUD) */}
      <div className="absolute top-4 right-4 z-50 pointer-events-none">
        {store.syncStatus !== 'idle' && (
          <div className="glass px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-right-4">
            {store.syncStatus === 'syncing' ? (
              <RefreshCw className="h-3 w-3 text-blue-500 animate-spin" />
            ) : store.syncStatus === 'success' ? (
              <Cloud className="h-3 w-3 text-green-500" />
            ) : (
              <AlertCircle className="h-3 w-3 text-red-500" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
              {store.syncStatus === 'syncing' ? 'Syncing...' : store.syncStatus === 'success' ? 'Cloud Updated' : 'Sync Error'}
            </span>
          </div>
        )}
      </div>

      <div className={`relative z-10 flex w-full h-full transition-all duration-500 ${hasBackground ? 'bg-white/10' : ''}`} style={{ backdropFilter: hasBackground ? `blur(${store.user.settings.blurAmount}px)` : 'none' }}>
        <Sidebar currentView={currentView} setView={setCurrentView} user={store.user} />

        <div className={`md:hidden fixed top-0 left-0 right-0 h-16 glass flex items-center justify-between px-6 z-50 ${isPWA ? 'pt-8 h-20' : ''}`}>
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-500" />
            <span className="font-bold text-lg">{currentView}</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

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
            </div>
          </div>
        )}

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
