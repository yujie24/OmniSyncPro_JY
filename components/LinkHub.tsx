
import React, { useState } from 'react';
import { LinkItem } from '../types';
import { categorizeLink } from '../services/geminiService';
import { Plus, Link as LinkIcon, FileCheck, Loader2, ExternalLink } from 'lucide-react';

interface LinkHubProps {
  links: LinkItem[];
  onAdd: (link: LinkItem) => void;
}

const LinkHub: React.FC<LinkHubProps> = ({ links, onAdd }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsProcessing(true);
    const result = await categorizeLink(urlInput);
    
    const newLink: LinkItem = {
      id: Date.now().toString(),
      url: urlInput,
      title: result.title,
      category: result.category,
      summary: result.summary,
      savedDate: Date.now(),
      format: result.suggestedFormat.toUpperCase() as any || 'PDF'
    };

    onAdd(newLink);
    setUrlInput('');
    setIsProcessing(false);
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Intelligent Link Storage</h1>
      </div>

      <form onSubmit={handleAddLink} className="mb-10">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="url"
              placeholder="Paste a link to analyze and save..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 text-lg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {isProcessing ? 'Analyzing...' : 'Auto-Save'}
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {links.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-300">
            <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No links saved yet. Start by pasting a URL above.</p>
          </div>
        ) : (
          links.map((link) => (
            <div key={link.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-5 items-start hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                link.format === 'PDF' ? 'bg-red-50 text-red-500' :
                link.format === 'PPT' ? 'bg-orange-50 text-orange-500' :
                'bg-blue-50 text-blue-500'
              }`}>
                <FileCheck className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg leading-tight">{link.title}</h3>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-500 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold uppercase text-gray-500">{link.category}</span>
                  <span className="px-2 py-0.5 bg-blue-100 rounded text-[10px] font-bold uppercase text-blue-600">Saved as {link.format}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{link.summary}</p>
                <p className="text-gray-400 text-xs mt-3">{new Date(link.savedDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LinkHub;
