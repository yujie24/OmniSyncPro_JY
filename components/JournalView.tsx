
import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { Plus, Book, Smile, Frown, Meh, Heart, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface JournalViewProps {
  entries: JournalEntry[];
  onAdd: (entry: JournalEntry) => void;
}

const JournalView: React.FC<JournalViewProps> = ({ entries, onAdd }) => {
  const { updateJournal, updateJournalMood } = useAppStore();
  const [activeId, setActiveId] = useState<string | null>(entries[0]?.id || null);
  const activeEntry = entries.find(e => e.id === activeId);

  const moods = [
    { icon: Smile, label: 'Happy', color: 'text-green-500', bg: 'bg-green-500' },
    { icon: Meh, label: 'Normal', color: 'text-blue-500', bg: 'bg-blue-500' },
    { icon: Frown, label: 'Sad', color: 'text-orange-500', bg: 'bg-orange-500' },
    { icon: Heart, label: 'Loved', color: 'text-red-500', bg: 'bg-red-500' },
  ];

  const handleCreate = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: 'Happy',
      content: ''
    };
    onAdd(newEntry);
    setActiveId(newEntry.id);
  };

  return (
    <div className="h-full flex overflow-hidden bg-white">
      {/* List Sidebar */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">My Journal</h2>
          <button 
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4" /> New Entry
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {entries.length === 0 ? (
            <div className="p-10 text-center opacity-30">
              <Book className="h-12 w-12 mx-auto mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest">No Entries</p>
            </div>
          ) : (
            entries.map(entry => {
              const moodData = moods.find(m => m.label === entry.mood) || moods[1];
              const MoodIcon = moodData.icon;
              return (
                <button
                  key={entry.id}
                  onClick={() => setActiveId(entry.id)}
                  className={`w-full text-left p-4 rounded-2xl mb-2 transition-all ${
                    activeId === entry.id ? 'bg-white shadow-md ring-1 ring-green-100' : 'hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MoodIcon className={`h-3 w-3 ${moodData.color}`} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{entry.date}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 line-clamp-1">{entry.content || 'Start writing...'}</p>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Entry Detail */}
      <div className="flex-1 flex flex-col">
        {activeEntry ? (
          <div className="flex-1 p-10 max-w-3xl mx-auto w-full overflow-y-auto">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-gray-50 rounded-2xl">
                    <CalendarIcon className="h-6 w-6 text-gray-400" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-gray-900">{activeEntry.date}</h3>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Daily Log</p>
                 </div>
              </div>
              
              <div className="flex gap-2">
                {moods.map(m => (
                  <button 
                    key={m.label}
                    onClick={() => updateJournalMood(activeEntry.id, m.label)}
                    className={`p-2 rounded-xl transition-all ${activeEntry.mood === m.label ? 'bg-green-50 text-green-600 ring-1 ring-green-200 shadow-sm' : 'text-gray-300 hover:bg-gray-50'}`}
                  >
                    <m.icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            <textarea 
              className="w-full h-[60vh] text-xl leading-relaxed outline-none resize-none placeholder-gray-200 font-serif"
              placeholder="How was your day?"
              value={activeEntry.content}
              onChange={(e) => updateJournal(activeEntry.id, e.target.value)}
            />
            <div className="mt-10 pt-10 border-t border-gray-50 flex items-center justify-between text-gray-300">
               <div className="flex items-center gap-4">
                 <Trash2 className="h-5 w-5 cursor-pointer hover:text-red-500 transition-colors" />
                 <p className="text-[10px] font-bold uppercase tracking-widest">Saved locally</p>
               </div>
               <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase">Ready to Sync</span>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20">
            <Book className="h-20 w-20 mb-4" />
            <p className="text-xl font-black italic tracking-tighter">Choose a memory to relive...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalView;
