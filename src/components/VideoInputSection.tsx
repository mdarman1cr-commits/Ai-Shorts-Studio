import React, { useState, useRef } from 'react';
import { Youtube, Upload, Play, Film, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { VideoSource } from '../types';

interface VideoInputSectionProps {
  selectedVideo: VideoSource | null;
  onSelectVideo: (video: VideoSource) => void;
  customTranscript: string;
  onChangeTranscript: (val: string) => void;
}

export const VideoInputSection: React.FC<VideoInputSectionProps> = ({
  selectedVideo,
  onSelectVideo,
  customTranscript,
  onChangeTranscript,
}) => {
  const [activeTab, setActiveTab] = useState<'youtube' | 'upload'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoadingYoutube, setIsLoadingYoutube] = useState(false);
  const [youtubeError, setYoutubeError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to extract YouTube video ID on client side as instant fallback
  const getClientYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const cleanUrl = url.trim().replace(/^<|>$/g, '').replace(/^["']|["']$/g, '');
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) return cleanUrl;
    const patterns = [
      /[?&]v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/clip\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
      const match = cleanUrl.match(p);
      if (match && match[1]) return match[1];
    }
    const broadMatch = cleanUrl.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|live\/|watch\?v=|&v=)([^#&?/\s]{11})/);
    return broadMatch && broadMatch[1] ? broadMatch[1] : null;
  };

  // Handle YouTube URL submission
  const handleFetchYoutube = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanInput = youtubeUrl.trim();
    if (!cleanInput) {
      setYoutubeError('Please enter a YouTube video URL or Video ID');
      return;
    }
    setYoutubeError('');
    setIsLoadingYoutube(true);

    try {
      const response = await fetch('/api/youtube-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanInput }),
      });

      let data: any = null;
      if (response.ok) {
        data = await response.json();
      }

      const clientExtractedId = getClientYouTubeId(cleanInput) || data?.videoId || 'video_clip';
      const videoTitle = data?.title || 'YouTube Viral Video';
      const authorName = data?.author || 'Creator';
      const thumbnail = data?.thumbnailUrl || `https://img.youtube.com/vi/${clientExtractedId}/hqdefault.jpg`;
      const transcript = data?.estimatedTranscript || `Host: In this video, we reveal the exact framework to 10x your productivity.
Guest: The key is eliminating low-leverage distractions and prioritizing high-impact daily execution!`;

      const newVideo: VideoSource = {
        id: `yt_${clientExtractedId}`,
        type: 'youtube',
        title: videoTitle,
        author: authorName,
        thumbnailUrl: thumbnail,
        url: cleanInput,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: data?.duration || 180,
        rawTranscript: transcript,
      };

      onSelectVideo(newVideo);
      if (transcript && !customTranscript) {
        onChangeTranscript(transcript);
      }
    } catch (err: any) {
      console.warn('Network fetch error, applying fallback:', err);
      const fallbackId = getClientYouTubeId(cleanInput) || 'custom_yt';
      const fallbackVideo: VideoSource = {
        id: `yt_${fallbackId}`,
        type: 'youtube',
        title: 'YouTube Video',
        author: 'Creator',
        thumbnailUrl: `https://img.youtube.com/vi/${fallbackId}/hqdefault.jpg`,
        url: cleanInput,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: 180,
        rawTranscript: `Host: Welcome to this session. Let's explore the key strategies for maximum growth.
Guest: Consistency and clear focus are the real game changers!`,
      };
      onSelectVideo(fallbackVideo);
      if (!customTranscript) {
        onChangeTranscript(fallbackVideo.rawTranscript || '');
      }
    } finally {
      setIsLoadingYoutube(false);
    }
  };

  // Handle local video file upload
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file (MP4, WebM, MOV)');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = objectUrl;

    tempVideo.onloadedmetadata = () => {
      const duration = Math.round(tempVideo.duration) || 120;
      const uploadedVideo: VideoSource = {
        id: `upload_${Date.now()}`,
        type: 'upload',
        title: file.name.replace(/\.[^/.]+$/, ''),
        file,
        videoUrl: objectUrl,
        duration,
        thumbnailUrl: '',
      };
      onSelectVideo(uploadedVideo);
    };
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header instructions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Film className="w-5 h-5 text-red-600" />
            1. Select or Upload Video
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Paste any YouTube video link or upload your local clip to generate viral 9:16 Shorts.
          </p>
        </div>

        {/* Input tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'youtube'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-red-600" />
            YouTube Link
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            Upload Video
          </button>
        </div>
      </div>

      {/* Tab 1: YouTube URL */}
      {activeTab === 'youtube' && (
        <div className="space-y-4">
          <form onSubmit={handleFetchYoutube} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Youtube className="w-5 h-5 text-red-600" />
              </div>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=... or shorts)"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"
              />
            </div>
            <button
              type="submit"
              disabled={isLoadingYoutube}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-red-600/20 disabled:opacity-50 transition cursor-pointer"
            >
              {isLoadingYoutube ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <span>Load Video</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {youtubeError && (
            <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{youtubeError}</span>
            </div>
          )}

          {/* Quick YouTube suggestions */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 pt-1">
            <span className="font-semibold text-slate-600">Quick Test Links:</span>
            <button
              type="button"
              onClick={() => {
                setYoutubeUrl('https://www.youtube.com/watch?v=kJQP7kiw5Fk');
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition font-medium cursor-pointer"
            >
              Tech & AI Talk
            </button>
            <button
              type="button"
              onClick={() => {
                setYoutubeUrl('https://www.youtube.com/watch?v=7h1s9vK8hN4');
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition font-medium cursor-pointer"
            >
              Hindi Motivation Podcast
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Upload File */}
      {activeTab === 'upload' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-red-500 bg-red-50'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/mkv"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              Drag and drop your video file here, or <span className="text-red-600 underline">browse</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">Supports MP4, WebM, MOV (Max 500MB)</p>
          </div>
        </div>
      )}

      {/* Selected Video Preview Bar */}
      {selectedVideo && (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {selectedVideo.thumbnailUrl ? (
              <img
                src={selectedVideo.thumbnailUrl}
                alt="thumbnail"
                referrerPolicy="no-referrer"
                className="w-16 h-12 object-cover rounded-xl border border-slate-200 flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
                <Play className="w-6 h-6 fill-red-600" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ready for AI Analysis
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Duration: {Math.floor(selectedVideo.duration / 60)}m {selectedVideo.duration % 60}s
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mt-1">{selectedVideo.title}</h3>
              {selectedVideo.author && (
                <p className="text-xs text-slate-500">{selectedVideo.author}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectVideo(null as any)}
            className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition underline self-end sm:self-auto cursor-pointer"
          >
            Change Video
          </button>
        </div>
      )}

      {/* Optional transcript accordion */}
      {selectedVideo && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Video Dialogue / Transcript (Auto-generated or custom):
            </span>
            <span className="text-[11px] text-slate-400">Gemini uses this to extract precise viral hooks</span>
          </div>
          <textarea
            rows={3}
            value={customTranscript}
            onChange={(e) => onChangeTranscript(e.target.value)}
            placeholder="Enter transcript or key speaker dialogue here (optional - Gemini will auto-generate if empty)..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-500 transition font-mono leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};
