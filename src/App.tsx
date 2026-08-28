import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Film, 
  Youtube, 
  Flame, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw,
  Video,
  Sliders,
  Palette,
  Type,
  Info,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { 
  AnalysisSettings, 
  ShortClip, 
  VideoAnalysisResult, 
  VideoSource 
} from './types';
import { getDefaultSubtitleConfig } from './data/presets';
import { Header } from './components/Header';
import { VideoInputSection } from './components/VideoInputSection';
import { CustomizationPanel } from './components/CustomizationPanel';
import { AnalysisProgressModal } from './components/AnalysisProgressModal';
import { ShortsList } from './components/ShortsList';
import { ShortsStudio } from './components/studio/ShortsStudio';
import { ViralAnalyticsDashboard } from './components/ViralAnalyticsDashboard';
import { RecentProjectsDrawer, SavedProject } from './components/RecentProjectsDrawer';

export default function App() {
  // Video Source State
  const [selectedVideo, setSelectedVideo] = useState<VideoSource | null>(null);
  const [customTranscript, setCustomTranscript] = useState<string>('');

  // Analysis & Style Settings State
  const [settings, setSettings] = useState<AnalysisSettings>({
    targetDuration: 30,
    numberOfShorts: 3,
    focusTone: 'viral_hook',
    language: 'hinglish',
    subtitleStyle: 'hormozi',
    colorGradePreset: 'teal_orange',
    smartFraming: 'center_crop',
    autoEmojis: true,
    highlightKeywords: true,
  });

  // Flow State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
  const [selectedShort, setSelectedShort] = useState<ShortClip | null>(null);
  const [viewMode, setViewMode] = useState<'input' | 'studio'>('input');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Recent Projects State with localStorage
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [isRecentProjectsOpen, setIsRecentProjectsOpen] = useState(false);

  // Load saved projects on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai_shorts_recent_projects');
      if (stored) {
        setSavedProjects(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent projects', e);
    }
  }, []);

  // Save projects helper
  const saveCurrentProject = (video: VideoSource, shorts: ShortClip[]) => {
    const newProject: SavedProject = {
      id: `proj_${Date.now()}`,
      timestamp: Date.now(),
      videoSource: video,
      shorts,
    };
    const updated = [newProject, ...savedProjects.filter((p) => p.videoSource.id !== video.id)].slice(0, 10);
    setSavedProjects(updated);
    try {
      localStorage.setItem('ai_shorts_recent_projects', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProject = (projId: string) => {
    const updated = savedProjects.filter((p) => p.id !== projId);
    setSavedProjects(updated);
    try {
      localStorage.setItem('ai_shorts_recent_projects', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadProject = (proj: SavedProject) => {
    setSelectedVideo(proj.videoSource);
    setAnalysisResult({
      videoSummary: proj.videoSource.title,
      shorts: proj.shorts,
    });
    setSelectedShort(proj.shorts[0] || null);
    setViewMode('studio');
  };

  // Handle Video Selection
  const handleSelectVideo = (video: VideoSource | null) => {
    setSelectedVideo(video);
    setErrorMsg(null);
    if (!video) {
      setCustomTranscript('');
      setAnalysisResult(null);
      setSelectedShort(null);
    }
  };

  // Perform AI Video Deep Analysis
  const handleStartAnalysis = async () => {
    if (!selectedVideo) {
      setErrorMsg('Please select or upload a video first');
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: selectedVideo.title,
          transcript: customTranscript || selectedVideo.rawTranscript || selectedVideo.title,
          videoUrl: selectedVideo.videoUrl || selectedVideo.url,
          targetDuration: settings.targetDuration,
          numberOfShorts: settings.numberOfShorts,
          focusTone: settings.focusTone,
          language: settings.language,
          subtitleStyle: settings.subtitleStyle,
          colorGradePreset: settings.colorGradePreset,
          smartFraming: settings.smartFraming,
          totalDuration: selectedVideo.duration || 180,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to analyze video');
      }

      const result: VideoAnalysisResult = await response.json();
      const shortsWithCustomSubs = (result.shorts || []).map((s) => ({
        ...s,
        subtitleCustom: s.subtitleCustom || settings.subtitleCustom || getDefaultSubtitleConfig(settings.subtitleStyle),
      }));
      const finalResult: VideoAnalysisResult = { ...result, shorts: shortsWithCustomSubs };
      
      setAnalysisResult(finalResult);

      if (shortsWithCustomSubs.length > 0) {
        setSelectedShort(shortsWithCustomSubs[0]);
        setViewMode('studio');
        saveCurrentProject(selectedVideo, shortsWithCustomSubs);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMsg(err.message || 'An error occurred during video analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Update active short clip edits in real-time
  const handleUpdateShort = (updatedShort: ShortClip) => {
    setSelectedShort(updatedShort);
    if (analysisResult) {
      const updatedShorts = analysisResult.shorts.map((s) =>
        s.id === updatedShort.id ? updatedShort : s
      );
      setAnalysisResult({ ...analysisResult, shorts: updatedShorts });
      if (selectedVideo) {
        saveCurrentProject(selectedVideo, updatedShorts);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <Header
        onNewProject={() => {
          setViewMode('input');
        }}
        hasActiveShorts={!!analysisResult}
        onToggleRecentProjects={() => setIsRecentProjectsOpen(true)}
        recentProjectsCount={savedProjects.length}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Error notification banner */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between shadow-sm">
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-600 flex-shrink-0" />
              {errorMsg}
            </span>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="text-xs font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Mode 1: Input & Configuration */}
        {viewMode === 'input' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Hero Quick Explainer Banner */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-9 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-600">
                  <Flame className="w-3.5 h-3.5 fill-red-500" />
                  AI YouTube to 9:16 Shorts Automation
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  YouTube Video Se Viral Shorts Banao <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
                    Dynamic Subtitles, Analytics & Color Grading Ke Saath
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Apna YouTube video link paste karein ya video upload karein. Deep AI analysis ke zariye exact viral hooks, recharts audience retention curve, word-by-word animated subtitles, aur Hollywood color grading automatic generate hongi.
                </p>
              </div>
            </div>

            {/* Step 1: Video Input & Transcript */}
            <VideoInputSection
              selectedVideo={selectedVideo}
              onSelectVideo={handleSelectVideo}
              customTranscript={customTranscript}
              onChangeTranscript={setCustomTranscript}
            />

            {/* Step 2: Customization Panel */}
            <CustomizationPanel
              settings={settings}
              onChangeSettings={setSettings}
              onGenerate={handleStartAnalysis}
              isGenerating={isAnalyzing}
              disabled={!selectedVideo}
            />

            {/* If previous results exist, show Viral Analytics & Gallery below */}
            {analysisResult && analysisResult.shorts.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-slate-200">
                {/* Recharts Analytics Dashboard */}
                <ViralAnalyticsDashboard
                  shorts={analysisResult.shorts}
                  selectedShort={selectedShort}
                  onSelectShort={(short) => {
                    setSelectedShort(short);
                    setViewMode('studio');
                  }}
                />

                <ShortsList
                  shorts={analysisResult.shorts}
                  selectedShort={selectedShort}
                  onSelectShort={(short) => {
                    setSelectedShort(short);
                    setViewMode('studio');
                  }}
                  videoSource={selectedVideo}
                />
              </div>
            )}
          </div>
        )}

        {/* View Mode 2: Interactive 9:16 Shorts Studio */}
        {viewMode === 'studio' && selectedShort && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <ShortsStudio
              shortClip={selectedShort}
              onUpdateShort={handleUpdateShort}
              onBack={() => setViewMode('input')}
              videoSource={selectedVideo}
              subtitleStyle={settings.subtitleStyle}
              onChangeSubtitleStyle={(newStyle) =>
                setSettings({ ...settings, subtitleStyle: newStyle })
              }
            />

            {/* Recharts Viral Analytics Section in Studio */}
            {analysisResult && analysisResult.shorts.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <ViralAnalyticsDashboard
                  shorts={analysisResult.shorts}
                  selectedShort={selectedShort}
                  onSelectShort={(short) => {
                    setSelectedShort(short);
                  }}
                />
              </div>
            )}

            {/* Other extracted shorts gallery bar */}
            {analysisResult && analysisResult.shorts.length > 1 && (
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-500" />
                    Other Extracted Shorts from this Video
                  </h3>
                  <span className="text-xs text-slate-500">Click any card to switch editor</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {analysisResult.shorts.map((short, idx) => {
                    const isSelected = selectedShort?.id === short.id;
                    return (
                      <div
                        key={short.id}
                        onClick={() => setSelectedShort(short)}
                        className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                          isSelected
                            ? 'border-red-500 bg-red-50 ring-2 ring-red-500/30 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-black text-slate-800">Short #{idx + 1}</span>
                          <span className="text-amber-700 font-bold font-mono flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {short.viralScore}/100 Score
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {short.hookHeadline}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {Math.round(short.duration)}s Duration • {short.subtitles?.length || 0} Captions
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* AI Processing Animated Progress Modal */}
      <AnalysisProgressModal
        isOpen={isAnalyzing}
        videoTitle={selectedVideo?.title || 'Processing Video'}
      />

      {/* Recent Projects Drawer */}
      <RecentProjectsDrawer
        isOpen={isRecentProjectsOpen}
        onClose={() => setIsRecentProjectsOpen(false)}
        savedProjects={savedProjects}
        onLoadProject={handleLoadProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>
          AI YouTube Shorts Studio • Deep Analysis, Animated Subtitles & Cinematic Color Grading
        </p>
      </footer>
    </div>
  );
}
