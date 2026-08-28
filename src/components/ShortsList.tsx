import React from 'react';
import { 
  Flame, 
  Clock, 
  Play, 
  Sparkles, 
  Palette, 
  Type, 
  ArrowRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { ShortClip, VideoSource } from '../types';
import { COLOR_PRESETS } from '../data/presets';

interface ShortsListProps {
  shorts: ShortClip[];
  selectedShort: ShortClip | null;
  onSelectShort: (short: ShortClip) => void;
  videoSource: VideoSource | null;
}

export const ShortsList: React.FC<ShortsListProps> = ({
  shorts,
  selectedShort,
  onSelectShort,
  videoSource,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Extracted Shorts ({shorts.length} Generated)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Select any Short below to fine-tune color grading, edit subtitles, adjust framing, and export 9:16 video.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shorts.map((short, idx) => {
          const isSelected = selectedShort?.id === short.id;
          const colorPreset = COLOR_PRESETS[short.colorGrade.preset] || COLOR_PRESETS.teal_orange;
          
          return (
            <div
              key={short.id}
              onClick={() => onSelectShort(short)}
              className={`rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group shadow-xs ${
                isSelected
                  ? 'border-red-500 bg-red-50/40 ring-2 ring-red-500/30 shadow-md shadow-red-500/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Top Bar: Short number & Viral Score badge */}
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-800">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-red-500" />
                    {Math.floor(short.startTime / 60)}:{(Math.floor(short.startTime) % 60).toString().padStart(2, '0')} - {Math.floor(short.endTime / 60)}:{(Math.floor(short.endTime) % 60).toString().padStart(2, '0')} ({Math.round(short.duration)}s)
                  </span>
                </div>

                {/* Viral Score Pill */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black shadow-2xs">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{short.viralScore}/100</span>
                </div>
              </div>

              {/* Hook Headline */}
              <div className="space-y-1.5 mb-4">
                <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-red-600 transition">
                  {short.hookHeadline}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {short.hookSummary}
                </p>
              </div>

              {/* Subtitle Snippet */}
              {short.subtitles && short.subtitles.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 mb-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Type className="w-3 h-3 text-blue-600" />
                    Opening Dialogue:
                  </div>
                  <p className="text-xs text-slate-700 italic font-mono line-clamp-1">
                    "{short.subtitles[0]?.text}"
                  </p>
                </div>
              )}

              {/* Bottom features & button */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    <Palette className="w-3 h-3" />
                    {colorPreset.name.split(' ')[0]}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {short.subtitles?.length || 0} Lines
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectShort(short);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
