import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Repeat, 
  Sparkles,
  Layers,
  Layout
} from 'lucide-react';
import { ShortClip, SubtitleStyleName, VideoSource, CustomSubtitleSettings } from '../../types';
import { SUBTITLE_STYLES, getDefaultSubtitleConfig } from '../../data/presets';

interface VideoCanvasPlayerProps {
  shortClip: ShortClip;
  videoSource: VideoSource | null;
  subtitleStyle: SubtitleStyleName;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
}

export const VideoCanvasPlayer: React.FC<VideoCanvasPlayerProps> = ({
  shortClip,
  videoSource,
  subtitleStyle,
  currentTime,
  onTimeUpdate,
  isPlaying,
  onTogglePlay,
  onSeek,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const customConfig: CustomSubtitleSettings = shortClip.subtitleCustom || getDefaultSubtitleConfig(subtitleStyle);
  const styleConfig = SUBTITLE_STYLES[subtitleStyle] || SUBTITLE_STYLES.hormozi;

  // Video stream source URL
  const videoSrc = videoSource?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  // Manage video playback & clip bounds
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      // If outside boundaries, reset to start
      if (video.currentTime < shortClip.startTime || video.currentTime > shortClip.endTime) {
        video.currentTime = shortClip.startTime;
      }
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, shortClip.startTime, shortClip.endTime]);

  // Sync playback speed imperatively
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Sync internal video time with external state
  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const currentAbsolute = video.currentTime;
    // Check if loop condition met
    if (currentAbsolute >= shortClip.endTime) {
      if (isLooping) {
        video.currentTime = shortClip.startTime;
        onTimeUpdate(0);
      } else {
        video.pause();
        onTogglePlay();
      }
      return;
    }

    const clipRelativeTime = Math.max(0, currentAbsolute - shortClip.startTime);
    onTimeUpdate(clipRelativeTime);
  };

  // Find currently active subtitle line and active word based on clip relative time
  const currentLine = customConfig.enabled !== false
    ? shortClip.subtitles?.find((line) => currentTime >= line.start && currentTime <= line.end)
    : null;

  // Subtitle styling calculations
  const fontClass = customConfig.fontSize === 'sm' 
    ? 'text-xs sm:text-sm' 
    : customConfig.fontSize === 'md' 
    ? 'text-sm sm:text-base' 
    : customConfig.fontSize === 'lg' 
    ? 'text-base sm:text-lg' 
    : customConfig.fontSize === 'xl' 
    ? 'text-lg sm:text-xl' 
    : 'text-xl sm:text-2xl';

  const textShadowCSS = customConfig.textShadow === 'heavy_stroke'
    ? '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 0px 4px 8px rgba(0,0,0,0.8)'
    : customConfig.textShadow === 'soft_glow'
    ? `0 0 12px ${customConfig.highlightColor}88, 0 0 20px rgba(0,0,0,0.9)`
    : customConfig.textShadow === 'drop_shadow'
    ? '2px 3px 6px rgba(0,0,0,0.9)'
    : 'none';

  const bgStyleClass = customConfig.backgroundStyle === 'box'
    ? 'bg-black/90 border border-white/20'
    : customConfig.backgroundStyle === 'pill'
    ? 'bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl'
    : customConfig.backgroundStyle === 'neon_outline'
    ? 'bg-black/80 border-2 border-amber-400/90 shadow-lg shadow-amber-400/30 rounded-xl'
    : 'bg-transparent';

  const yPos = customConfig.yOffsetPercent !== undefined ? customConfig.yOffsetPercent : (customConfig.position === 'top' ? 20 : customConfig.position === 'middle' ? 50 : 78);

  // Compute CSS filter string for cinematic color grading
  const { colorGrade } = shortClip;
  const filterString = `
    brightness(${colorGrade.brightness})
    contrast(${colorGrade.contrast})
    saturate(${colorGrade.saturate})
    sepia(${colorGrade.sepia})
    hue-rotate(${colorGrade.hueRotate}deg)
  `.trim();

  return (
    <div className="flex flex-col items-center justify-center">
      {/* 9:16 Smartphone Vertical Bezel Container */}
      <div className="relative w-full max-w-[310px] sm:max-w-[340px] aspect-[9/16] bg-black rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl shadow-slate-900/40 flex flex-col justify-between select-none">
        
        {/* Real Video Element & Framing Wrapper */}
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
          {/* Blurred backdrop layer if blur_padding layout */}
          {shortClip.layoutMode === 'blur_padding' && (
            <video
              src={videoSrc}
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-60"
            />
          )}

          {/* Main Video */}
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            muted={isMuted}
            onTimeUpdate={handleVideoTimeUpdate}
            onClick={onTogglePlay}
            style={{ filter: filterString }}
            className={`cursor-pointer transition-all duration-200 ${
              shortClip.layoutMode === 'center_crop'
                ? 'w-full h-full object-cover scale-110'
                : shortClip.layoutMode === 'split_screen'
                ? 'w-full h-[85%] object-cover'
                : shortClip.layoutMode === 'blur_padding'
                ? 'w-full h-auto object-contain z-10'
                : 'w-full h-full object-cover'
            }`}
          />

          {/* Split Screen Divider (if enabled) */}
          {shortClip.layoutMode === 'split_screen' && (
            <div className="absolute inset-x-0 top-1/2 h-1 bg-red-500/80 z-20 shadow-md shadow-red-500" />
          )}

          {/* Vignette Overlay (Dark edges for cinematic look) */}
          {colorGrade.vignette > 0 && (
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,${colorGrade.vignette * 0.95}) 100%)`,
              }}
            />
          )}

          {/* Film Grain Simulation Overlay */}
          {colorGrade.grain > 0 && (
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: '3px 3px',
              }}
            />
          )}

          {/* Color Grade Preset Tag Watermark */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-zinc-200 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>9:16 Shorts • {colorGrade.preset.replace('_', ' ').toUpperCase()}</span>
          </div>

          {/* Virality Hook Top Banner */}
          <div className="absolute top-12 inset-x-3 z-20 text-center pointer-events-none">
            <span className="inline-block px-3 py-1 rounded-lg bg-red-600/90 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/40 animate-bounce">
              {shortClip.hookHeadline || 'MUST WATCH! 🔥'}
            </span>
          </div>

          {/* Animated Dynamic Subtitles Overlay Layer */}
          {currentLine && (
            <div
              className="absolute inset-x-3 z-30 flex flex-col items-center justify-center text-center transition-all duration-150 pointer-events-none"
              style={{
                top: `${yPos}%`,
                transform: 'translateY(-50%)',
              }}
            >
              <div
                className={`p-2.5 rounded-xl max-w-[95%] transition-transform duration-100 ${bgStyleClass} ${
                  customConfig.animation === 'pop' ? 'scale-105' : customConfig.animation === 'bounce' ? 'animate-bounce' : 'scale-100'
                }`}
                style={{
                  fontFamily: customConfig.fontFamily,
                  textShadow: textShadowCSS,
                }}
              >
                <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
                  {currentLine.words && currentLine.words.length > 0 ? (
                    currentLine.words.map((w, wIdx) => {
                      const isWordActive = currentTime >= w.start && currentTime <= w.end;
                      const isHighlighted = w.highlight || isWordActive;

                      return (
                        <span
                          key={wIdx}
                          className={`inline-block transition-all duration-75 ${
                            isWordActive
                              ? 'scale-115 transform font-black'
                              : isHighlighted
                              ? 'font-extrabold'
                              : 'font-bold'
                          } ${fontClass}`}
                          style={{
                            color: isWordActive
                              ? customConfig.highlightColor
                              : isHighlighted
                              ? customConfig.highlightColor
                              : customConfig.textColor,
                            textTransform: (customConfig.textTransform as any) || 'none',
                          }}
                        >
                          {w.word}
                          {w.emoji && <span className="ml-1">{w.emoji}</span>}
                        </span>
                      );
                    })
                  ) : (
                    <span
                      className={`font-black ${fontClass}`}
                      style={{
                        color: customConfig.highlightColor,
                        textTransform: (customConfig.textTransform as any) || 'none',
                      }}
                    >
                      {currentLine.text}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Center Play Overlay Button on hover/pause */}
          {!isPlaying && (
            <div
              onClick={onTogglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs z-25 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl shadow-red-600/50 hover:scale-110 transition">
                <Play className="w-8 h-8 ml-1 fill-white" />
              </div>
            </div>
          )}
        </div>

        {/* In-Player Scrubber Line */}
        <div className="absolute bottom-0 inset-x-0 z-30 h-1.5 bg-zinc-800/80">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-75"
            style={{
              width: `${Math.min(100, (currentTime / Math.max(1, shortClip.duration)) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Media Controls Bar Under Player */}
      <div className="w-full max-w-[340px] mt-4 bg-white border border-slate-200 rounded-3xl p-3.5 shadow-sm space-y-2.5">
        {/* Timeline Slider */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-500 w-9 text-right">
            {Math.floor(currentTime)}s
          </span>
          <input
            type="range"
            min={0}
            max={shortClip.duration || 30}
            step={0.1}
            value={currentTime}
            onChange={(e) => {
              const newRelTime = Number(e.target.value);
              onSeek(newRelTime);
              if (videoRef.current) {
                videoRef.current.currentTime = shortClip.startTime + newRelTime;
              }
            }}
            className="flex-1 accent-red-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <span className="text-[11px] font-mono font-bold text-slate-500 w-9">
            {Math.round(shortClip.duration)}s
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onTogglePlay}
              className="w-9 h-9 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition shadow-md shadow-red-600/20 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 ml-0.5 fill-white" />}
            </button>

            <button
              type="button"
              onClick={() => {
                onSeek(0);
                if (videoRef.current) {
                  videoRef.current.currentTime = shortClip.startTime;
                }
              }}
              title="Restart Short"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsLooping(!isLooping)}
              title={isLooping ? 'Looping Enabled' : 'Looping Disabled'}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer ${
                isLooping ? 'bg-amber-50 text-amber-800 border border-amber-300 font-bold' : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Speed toggle */}
            <button
              type="button"
              onClick={() => {
                const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
                setPlaybackRate(nextRate);
                if (videoRef.current) videoRef.current.playbackRate = nextRate;
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-mono font-bold hover:bg-slate-200 border border-slate-200 cursor-pointer"
            >
              {playbackRate}x
            </button>

            {/* Mute */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition border border-slate-200 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-600" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
