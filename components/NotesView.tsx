
import React, { useState } from 'react';
import { Note } from '../types';
// Added FileText to the imports from lucide-react
import { Plus, Search, Trash2, Calendar as CalendarIcon, Tag, FileText } from 'lucide-react';

interface NotesViewProps {
  notes: Note[];
  onAddNote: (note: Note) => void;
  onUpdateNote: (id: string, updated: Partial<Note>) => void;
}

const NotesView: React.FC<NotesViewProps> = ({ notes, onAddNote, onUpdateNote }) => {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleCreate = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      lastModified: Date.now(),
      tags: []
    };
    onAddNote(newNote);
    setActiveNoteId(newNote.id);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* List Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white/50">
        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Notes" 
              className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none"
            />
          </div>
          <button 
            onClick={handleCreate}
            className="w-full flex items-center justify-center gap-2 py-2 bg-yellow-400 text-yellow-900 rounded-lg font-semibold text-sm hover:bg-yellow-500 transition-colors"
          >
            <Plus className="h-4 w-4" /> New Note
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notes.map(note => (
            <button
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`w-full text-left p-4 border-b border-gray-100 transition-colors ${
                activeNoteId === note.id ? 'bg-yellow-50 border-r-4 border-r-yellow-400' : 'hover:bg-gray-50'
              }`}
            >
              <h3 className="font-bold text-sm truncate mb-1">{note.title || 'Untitled Note'}</h3>
              <p className="text-xs text-gray-500 line-clamp-1 mb-2">{note.content || 'No additional text'}</p>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-3 w-3 text-gray-400" />
                <span className="text-[10px] text-gray-400">{new Date(note.lastModified).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor View */}
      <div className="flex-1 bg-white flex flex-col">
        {activeNote ? (
          <>
            <div className="px-8 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-4 text-gray-400">
                <span className="text-xs">{new Date(activeNote.lastModified).toLocaleString()}</span>
                <div className="h-4 w-px bg-gray-200"></div>
                <div className="flex gap-2">
                  {activeNote.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] flex items-center gap-1">
                      <Tag className="h-2.5 w-2.5" /> {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="flex-1 p-10 overflow-y-auto max-w-4xl mx-auto w-full">
              <input
                className="w-full text-4xl font-extrabold mb-8 outline-none placeholder-gray-300"
                placeholder="Note Title"
                value={activeNote.title}
                onChange={(e) => onUpdateNote(activeNote.id, { title: e.target.value, lastModified: Date.now() })}
              />
              <textarea
                className="w-full h-full text-lg leading-relaxed outline-none resize-none placeholder-gray-300"
                placeholder="Start writing..."
                value={activeNote.content}
                onChange={(e) => onUpdateNote(activeNote.id, { content: e.target.value, lastModified: Date.now() })}
              />
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <FileText className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-xl">Select a note to view or edit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesView;
