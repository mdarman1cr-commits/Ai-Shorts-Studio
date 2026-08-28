import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Palette, 
  Type, 
  Smartphone, 
  Youtube, 
  Download, 
  Sparkles, 
  Flame, 
  Clock, 
  Share2,
  Sliders,
  BarChart3
} from 'lucide-react';
import { ShortClip, SubtitleStyleName, VideoSource } from '../../types';
import { VideoCanvasPlayer } from './VideoCanvasPlayer';
import { ColorGradingStudio } from './ColorGradingStudio';
import { SubtitleStudio } from './SubtitleStudio';
import { FramingStudio } from './FramingStudio';
import { ViralMetadataCard } from './ViralMetadataCard';
import { VideoExporter } from './VideoExporter';

interface ShortsStudioProps {
  shortClip: ShortClip;
  onUpdateShort: (updated: ShortClip) => void;
  onBack: () => void;
  videoSource: VideoSource | null;
  subtitleStyle: SubtitleStyleName;
  onChangeSubtitleStyle: (style: SubtitleStyleName) => void;
}

export const ShortsStudio: React.FC<ShortsStudioProps> = ({
  shortClip,
  onUpdateShort,
  onBack,
  videoSource,
  subtitleStyle,
  onChangeSubtitleStyle,
}) => {
  const [activeTab, setActiveTab] = useState<'color' | 'subtitles' | 'framing' | 'metadata' | 'export'>('color');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const tabs = [
    { id: 'color', label: 'Color Grading', icon: Palette, badge: shortClip.colorGrade.preset.replace('_', ' ') },
    { id: 'subtitles', label: 'Subtitles & Emojis', icon: Type, count: shortClip.subtitles?.length },
    { id: 'framing', label: '9:16 Framing', icon: Smartphone },
    { id: 'metadata', label: 'Viral SEO', icon: Youtube },
    { id: 'export', label: 'Export Video', icon: Download, highlight: true },
  ];

  return (
    <div className="space-y-6">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span className="hidden sm:inline">All Shorts</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-black uppercase">
                Active 9:16 Short
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-red-500" />
                {Math.round(shortClip.duration)}s Duration
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 mt-0.5">
              {shortClip.hookHeadline || shortClip.title}
            </h2>
          </div>
        </div>

        {/* Viral Score Indicator */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black shadow-2xs">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Viral Score: {shortClip.viralScore}/100</span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left 9:16 Player, Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 9:16 Video Player Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <VideoCanvasPlayer
            shortClip={shortClip}
            videoSource={videoSource}
            subtitleStyle={subtitleStyle}
            currentTime={currentTime}
            onTimeUpdate={(t) => setCurrentTime(t)}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onSeek={(t) => setCurrentTime(t)}
          />
        </div>

        {/* Right Column: Studio Tools & Controls */}
        <div className="lg:col-span-7 space-y-4">
          {/* Studio Tab Navigation */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const isCurrent = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isCurrent
                      ? tab.highlight
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-sm font-black'
                        : 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-black'
                      : tab.highlight
                      ? 'text-amber-700 hover:bg-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab View Component */}
          {activeTab === 'color' && (
            <ColorGradingStudio
              colorGrade={shortClip.colorGrade}
              onChangeColorGrade={(cg) => onUpdateShort({ ...shortClip, colorGrade: cg })}
            />
          )}

          {activeTab === 'subtitles' && (
            <SubtitleStudio
              subtitles={shortClip.subtitles}
              onChangeSubtitles={(subs) => onUpdateShort({ ...shortClip, subtitles: subs })}
              subtitleStyle={subtitleStyle}
              onChangeSubtitleStyle={onChangeSubtitleStyle}
              subtitleCustom={shortClip.subtitleCustom}
              onChangeSubtitleCustom={(custom) => onUpdateShort({ ...shortClip, subtitleCustom: custom })}
              currentTime={currentTime}
              onSeekTo={(t) => {
                setCurrentTime(t);
                setIsPlaying(true);
              }}
            />
          )}

          {activeTab === 'framing' && (
            <FramingStudio
              layoutMode={shortClip.layoutMode}
              onChangeLayoutMode={(mode) => onUpdateShort({ ...shortClip, layoutMode: mode })}
            />
          )}

          {activeTab === 'metadata' && (
            <ViralMetadataCard shortClip={shortClip} />
          )}

          {activeTab === 'export' && (
            <VideoExporter
              shortClip={shortClip}
              videoSource={videoSource}
              subtitleStyle={subtitleStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
};
