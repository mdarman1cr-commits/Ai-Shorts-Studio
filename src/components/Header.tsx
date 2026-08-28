import React from 'react';
import { Sparkles, Video, Film, Wand2, Youtube, Flame, History } from 'lucide-react';

interface HeaderProps {
  onNewProject?: () => void;
  hasActiveShorts?: boolean;
  onToggleRecentProjects?: () => void;
  recentProjectsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewProject,
  hasActiveShorts,
  onToggleRecentProjects,
  recentProjectsCount = 0,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onNewProject}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 shadow-md shadow-red-500/20 text-white font-black">
            <Youtube className="w-5 h-5" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-black ring-2 ring-white">
              AI
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                AI Shorts Studio
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                  <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                  Viral Engine
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              YouTube Video to 9:16 Shorts • Subtitles • Color Grading
            </p>
          </div>
        </div>

        {/* Right: Quick actions & Badges */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Gemini 3.7 Flash Analysis</span>
          </div>

          {/* Recent Projects Trigger Button */}
          <button
            type="button"
            onClick={onToggleRecentProjects}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition border border-slate-200 cursor-pointer shadow-xs"
          >
            <History className="w-3.5 h-3.5 text-red-500" />
            <span>Recent Projects</span>
            {recentProjectsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-600 text-white">
                {recentProjectsCount}
              </span>
            )}
          </button>

          {hasActiveShorts && (
            <button
              onClick={onNewProject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition shadow-xs cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              New Video
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
