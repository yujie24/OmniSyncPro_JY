
import React, { useState, useRef } from 'react';
import { ShieldCheck, Smartphone, Globe, Cloud, Apple, ChevronRight, CheckCircle2, Loader2, Image as ImageIcon, Trash2, Sliders, Share, Info, Download, Laptop } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const SettingsView: React.FC = () => {
  const { user, updateSettings } = useAppStore();
  const [publishing, setPublishing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulatePublish = () => {
    setPublishing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ backgroundImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-xl mx-auto p-6 pt-12">
        <h1 className="text-3xl font-extrabold mb-8 px-2 tracking-tight">Settings</h1>

        {/* User Profile */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden mb-8 shadow-sm">
          <div className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
               <img src={user.avatar} alt="Avatar" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500 text-sm">Apple ID, iCloud+, Media & Purchases</p>
            </div>
            <ChevronRight className="ml-auto text-gray-300 h-5 w-5" />
          </div>
        </div>

        {/* Installation Guide for Personal Use */}
        <div className="mb-8">
          <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Device Installation</h3>
          <div className="bg-blue-600 rounded-2xl overflow-hidden shadow-lg p-5 text-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-white/20 p-2 rounded-xl">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Use on your iPhone</h4>
                <p className="text-blue-100 text-xs">No App Store required for personal use.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowGuide(!showGuide)}
              className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-all"
            >
              VIEW STEP-BY-STEP GUIDE
            </button>
            
            {showGuide && (
              <div className="mt-5 space-y-4 border-t border-white/20 pt-5 animate-in fade-in slide-in-from-top-2">
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                  <p className="text-xs leading-relaxed"><span className="font-bold">PWA Method:</span> Open this URL in <span className="underline">Safari</span> on your iPhone, tap the <span className="font-bold">Share</span> button, then select <span className="font-bold">"Add to Home Screen"</span>.</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                  <p className="text-xs leading-relaxed"><span className="font-bold">Local Sync:</span> Host this on Vercel or Netlify for free. Both iPhone and Mac will sync data if you use the same URL (requires cloud DB in future).</p>
                </div>
                <div className="flex gap-3">
                  <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                  <p className="text-xs leading-relaxed"><span className="font-bold">Native:</span> Use Xcode on your Mac. Connect iPhone, select "Personal Team", and click Play. Valid for 7 days per session.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Personalization Section */}
        <div className="mb-8">
          <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Personalization</h3>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
            <div className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-[15px]">Custom Background</span>
                <p className="text-[11px] text-gray-400">Syncs across iPhone & Mac</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*" 
              />
              <div className="flex gap-2">
                {user.settings.backgroundImage && (
                   <button 
                    onClick={() => updateSettings({ backgroundImage: null })}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 px-4 py-1 rounded-full text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
                >
                  {user.settings.backgroundImage ? 'CHANGE' : 'UPLOAD'}
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-500 flex items-center justify-center text-white">
                  <Sliders className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-[15px]">Glass Blur Amount</span>
                </div>
                <span className="text-xs font-bold text-gray-400">{user.settings.blurAmount}px</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="40" 
                value={user.settings.blurAmount}
                onChange={(e) => updateSettings({ blurAmount: parseInt(e.target.value) })}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Sync & Backup */}
        <div className="mb-8">
          <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data & Sync</h3>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
            <div className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Cloud className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-[15px]">Local Browser Sync</span>
                <p className="text-[11px] text-gray-400">Data persists in this device's browser</p>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-[10px] font-bold">ACTIVE</span>
              </div>
            </div>
            
            <div className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                <Share className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-[15px]">Export Backup</span>
                <p className="text-[11px] text-gray-400">JSON format for manual migration</p>
              </div>
              <button className="text-blue-600 text-xs font-bold">EXPORT</button>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-12 pb-12 leading-relaxed">
          OmniSync Pro v1.3.0<br/>
          Developed for Personal Productivity<br/>
          <span className="opacity-50 italic">Running in Offline-First Mode</span>
        </p>
      </div>
    </div>
  );
};

export default SettingsView;
