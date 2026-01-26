
import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, Note, JournalEntry, Task, LinkItem, User, AppSettings } from '../types';
import { syncToGist, fetchFromGist } from '../services/githubService';

export const useAppStore = () => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

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
        theme: 'auto',
        autoSync: false
      }
    };
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => JSON.parse(localStorage.getItem('omni_events') || '[]'));
  const [notes, setNotes] = useState<Note[]>(() => JSON.parse(localStorage.getItem('omni_notes') || '[]'));
  const [journal, setJournal] = useState<JournalEntry[]>(() => JSON.parse(localStorage.getItem('omni_journal') || '[]'));
  const [tasks, setTasks] = useState<Task[]>(() => JSON.parse(localStorage.getItem('omni_tasks') || '[]'));
  const [links, setLinks] = useState<LinkItem[]>(() => JSON.parse(localStorage.getItem('omni_links') || '[]'));

  // Save to Local Storage
  useEffect(() => {
    localStorage.setItem('omni_user', JSON.stringify(user));
    localStorage.setItem('omni_events', JSON.stringify(events));
    localStorage.setItem('omni_notes', JSON.stringify(notes));
    localStorage.setItem('omni_journal', JSON.stringify(journal));
    localStorage.setItem('omni_tasks', JSON.stringify(tasks));
    localStorage.setItem('omni_links', JSON.stringify(links));
  }, [user, events, notes, journal, tasks, links]);

  const performSync = useCallback(async () => {
    if (!user.settings.githubToken) return;
    
    setSyncStatus('syncing');
    try {
      const data = { events, notes, journal, tasks, links, user: { name: user.name, avatar: user.avatar } };
      const result = await syncToGist(user.settings.githubToken, user.settings.gistId, data);
      
      if (!user.settings.gistId) {
        setUser(prev => ({ ...prev, settings: { ...prev.settings, gistId: result.id } }));
      }
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setSyncStatus('error');
    }
  }, [user, events, notes, journal, tasks, links]);

  // Auto-sync trigger
  useEffect(() => {
    if (user.settings.autoSync && user.settings.githubToken) {
      const timer = setTimeout(performSync, 5000); // 5s debounce for auto-sync
      return () => clearTimeout(timer);
    }
  }, [events, notes, journal, tasks, links, user.settings.autoSync, performSync]);

  const updateSettings = (settings: Partial<AppSettings>) => {
    setUser(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings },
      lastSync: Date.now()
    }));
  };

  const addEvent = (event: CalendarEvent) => setEvents([...events, event]);
  const addNote = (note: Note) => setNotes([note, ...notes]);
  const updateNote = (id: string, updated: Partial<Note>) => 
    setNotes(notes.map(n => n.id === id ? { ...n, ...updated, lastModified: Date.now() } : n));
  
  const addJournal = (entry: JournalEntry) => setJournal([entry, ...journal]);
  const updateJournal = (id: string, content: string) =>
    setJournal(journal.map(j => j.id === id ? { ...j, content } : j));
  const updateJournalMood = (id: string, mood: string) =>
    setJournal(journal.map(j => j.id === id ? { ...j, mood } : j));

  const addTask = (task: Task) => setTasks([...tasks, task]);
  const updateTask = (id: string, updated: Partial<Task>) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updated } : t));
  
  const addLink = (link: LinkItem) => setLinks([link, ...links]);

  return {
    user, updateSettings, syncStatus, performSync,
    events, addEvent,
    notes, addNote, updateNote,
    journal, addJournal, updateJournal, updateJournalMood,
    tasks, addTask, updateTask,
    links, addLink
  };
};
