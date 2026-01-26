
export type AppView = 'Calendar' | 'Notes' | 'Journal' | 'Projects' | 'Links' | 'Settings';

export interface AppSettings {
  backgroundImage: string | null;
  blurAmount: number;
  theme: 'light' | 'dark' | 'auto';
  githubToken?: string;
  gistId?: string;
  autoSync: boolean;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  isICloud: boolean;
  lastSync: number;
  settings: AppSettings;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'work' | 'personal' | 'important';
  description?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  tags: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  content: string;
  attachments?: string[];
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  owner?: string;
}

export interface LinkItem {
  id: string;
  url: string;
  title: string;
  category: string;
  summary: string;
  savedDate: number;
  format: 'PDF' | 'DOC' | 'PPT' | 'WEB';
}
