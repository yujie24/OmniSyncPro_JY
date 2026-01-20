
import { useState, useEffect } from 'react';
import { CalendarEvent, Note, JournalEntry, Task, LinkItem, User, AppSettings } from '../types';

export const useAppStore = () => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('omni_user');
    return saved ? JSON.parse(saved) : {
      name: 'John Appleseed',
      email: 'j.appleseed@icloud.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      isICloud: true,
      lastSync: Date.now(),
      settings: {
        backgroundImage: null,
        blurAmount: 20,
        theme: 'auto'
      }
    };
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => 
    JSON.parse(localStorage.getItem('omni_events') || '[]'));
  
  const [notes, setNotes] = useState<Note[]>(() => 
    JSON.parse(localStorage.getItem('omni_notes') || '[]'));
  
  const [journal, setJournal] = useState<JournalEntry[]>(() => 
    JSON.parse(localStorage.getItem('omni_journal') || '[]'));
  
  const [tasks, setTasks] = useState<Task[]>(() => 
    JSON.parse(localStorage.getItem('omni_tasks') || '[]'));
  
  const [links, setLinks] = useState<LinkItem[]>(() => 
    JSON.parse(localStorage.getItem('omni_links') || '[]'));

  useEffect(() => localStorage.setItem('omni_user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('omni_events', JSON.stringify(events)), [events]);
  useEffect(() => localStorage.setItem('omni_notes', JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem('omni_journal', JSON.stringify(journal)), [journal]);
  useEffect(() => localStorage.setItem('omni_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('omni_links', JSON.stringify(links)), [links]);

  const updateSettings = (settings: Partial<AppSettings>) => {
    setUser({
      ...user,
      settings: { ...user.settings, ...settings },
      lastSync: Date.now()
    });
  };

  const addEvent = (event: CalendarEvent) => setEvents([...events, event]);
  const addNote = (note: Note) => setNotes([note, ...notes]);
  const updateNote = (id: string, updated: Partial<Note>) => 
    setNotes(notes.map(n => n.id === id ? { ...n, ...updated } : n));
  
  const addJournal = (entry: JournalEntry) => setJournal([entry, ...journal]);
  const addTask = (task: Task) => setTasks([...tasks, task]);
  const updateTask = (id: string, updated: Partial<Task>) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updated } : t));
  
  const addLink = (link: LinkItem) => setLinks([link, ...links]);

  return {
    user,
    updateSettings,
    events, addEvent,
    notes, addNote, updateNote,
    journal, addJournal,
    tasks, addTask, updateTask,
    links, addLink
  };
};
