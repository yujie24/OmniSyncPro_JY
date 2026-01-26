
import React, { useState, useRef } from 'react';
import { Cloud, ChevronRight, CheckCircle2, Image as ImageIcon, Trash2, Sliders, Share, Github, RefreshCw, Lock, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const SettingsView: React.FC = () => {
  const { user, updateSettings, syncStatus, performSync } = useAppStore();
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="h-full overflow-y-auto bg-gray-50/50">
      <div className="max-w-xl mx-auto p-6 pt-12">
        <h1 className="text-3xl font-extrabold mb-8 px-2 tracking-tight">Settings</h1>

        {/* User Profile */}
        <div className="bg-white rounded-2xl overflow-hidden mb-8 shadow-sm border border-gray-100">
          <div className="p-4 flex items-center gap-4">
            <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full bg-blue-50 border border-gray-100" />
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
            <ChevronRight className="ml-auto text-gray-300 h-5 w-5" />
          </div>
        </div>

        {/* GitHub Cloud Sync Section */}
        <div className="mb-8">
          <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cloud Sync (GitHub)</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
            <div className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white">
                  <Github className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">GitHub Personal Access Token</h4>
                  <p className="text-[11px] text-gray-400">Used for syncing data between iPhone & Mac</p>
                </div>
              </div>
              
              <div className="relative mb-4">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-300" />
                <input 
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxx"
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={user.settings.githubToken || ''}
                  onChange={(e) => updateSettings({ githubToken: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                 <span className="text-xs font-medium text-gray-600">Auto-sync after changes</span>
                 <button 
                  onClick={() => updateSettings({ autoSync: !user.settings.autoSync })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${user.settings.autoSync ? 'bg-green-500' : 'bg-gray-200'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${user.settings.autoSync ? 'left-5' : 'left-1'}`} />
                 </button>
              </div>

              <button 
                onClick={performSync}
                disabled={!user.settings.githubToken || syncStatus === 'syncing'}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 disabled:opacity-30"
              >
                {syncStatus === 'syncing' ? <RefreshCw className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                {syncStatus === 'syncing' ? 'SYNCING...' : 'SYNC TO GITHUB NOW'}
              </button>
              
              {syncStatus === 'error' && (
                <div className="mt-3 flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase">
                  <AlertCircle className="h-3 w-3" /> Sync failed. Check your token.
                </div>
              )}
              {syncStatus === 'success' && (
                <div className="mt-3 flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase">
                  <CheckCircle2 className="h-3 w-3" /> Sync Successful
                </div>
              )}
            </div>
            <div className="p-4 bg-blue-50/50">
               <p className="text-[10px] text-blue-600 leading-relaxed font-medium">
                 💡 <strong>Tip:</strong> Create a token at github.com/settings/tokens with 'gist' scope. Use the same token on all your devices to share data.
               </p>
            </div>
          </div>
        </div>

        {/* Personalization Section */}
        <div className="mb-8">
          <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Appearance</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
            <div className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-[15px]">Wallpaper</span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              <div className="flex gap-2">
                {user.settings.backgroundImage && (
                   <button onClick={() => updateSettings({ backgroundImage: null })} className="p-2 text-red-500"><Trash2 className="h-4 w-4" /></button>
                )}
                <button onClick={() => fileInputRef.current?.click()} className="bg-gray-100 px-4 py-1.5 rounded-full text-[10px] font-bold text-gray-900 hover:bg-gray-200">
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
                  <span className="font-medium text-[15px]">Blur Amount</span>
                </div>
                <span className="text-xs font-bold text-gray-400">{user.settings.blurAmount}px</span>
              </div>
              <input 
                type="range" min="0" max="40" value={user.settings.blurAmount}
                onChange={(e) => updateSettings({ blurAmount: parseInt(e.target.value) })}
                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Local Sync Status */}
        <div className="mb-8">
          <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Device</h3>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Cloud className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="font-medium text-[15px]">Local Persistance</span>
                <p className="text-[11px] text-gray-400">Data stays on this device's disk</p>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-tight">Active</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-12 pb-12 leading-relaxed">
          OmniSync Pro v1.4.0<br/>
          Securely synced via GitHub Gist<br/>
          <span className="opacity-50 italic">End-to-End Privacy Enabled</span>
        </p>
      </div>
    </div>
  );
};

export default SettingsView;
