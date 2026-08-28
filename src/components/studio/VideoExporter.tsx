import React, { useState, useRef } from 'react';
import { 
  Download, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Video, 
  Layers, 
  Flame,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ShortClip, SubtitleStyleName, VideoSource, CustomSubtitleSettings } from '../../types';
import { SUBTITLE_STYLES, getDefaultSubtitleConfig } from '../../data/presets';

interface VideoExporterProps {
  shortClip: ShortClip;
  videoSource: VideoSource | null;
  subtitleStyle: SubtitleStyleName;
}

export const VideoExporter: React.FC<VideoExporterProps> = ({
  shortClip,
  videoSource,
  subtitleStyle,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const customConfig: CustomSubtitleSettings = shortClip.subtitleCustom || getDefaultSubtitleConfig(subtitleStyle);
  const styleConfig = SUBTITLE_STYLES[subtitleStyle] || SUBTITLE_STYLES.hormozi;

  const videoSrc = videoSource?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  // Generate .SRT Subtitle File Content
  const generateSRT = (): string => {
    let srt = '';
    shortClip.subtitles.forEach((line, idx) => {
      const formatTime = (sec: number) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = Math.floor(sec % 60);
        const ms = Math.floor((sec % 1) * 1000);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
      };

      srt += `${idx + 1}\n`;
      srt += `${formatTime(line.start)} --> ${formatTime(line.end)}\n`;
      srt += `${line.text}\n\n`;
    });
    return srt;
  };

  // Download SRT Subtitle
  const handleDownloadSRT = () => {
    const srtContent = generateSRT();
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${shortClip.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_subtitles.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render & Bake 9:16 Video using Canvas 2D + MediaRecorder
  const handleRenderVideo = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setDownloadUrl(null);
    setExportError(null);

    try {
      const video = hiddenVideoRef.current;
      const canvas = hiddenCanvasRef.current;
      if (!video || !canvas) {
        throw new Error('Video rendering engine unavailable');
      }

      // Canvas dimensions 720x1280 (9:16 vertical HD)
      const width = 720;
      const height = 1280;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not initialize 2D canvas context');

      // Set video boundaries
      video.currentTime = shortClip.startTime;
      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          resolve();
        };
        video.addEventListener('seeked', onSeeked);
      });

      // Setup MediaRecorder stream
      const stream = canvas.captureStream(30);
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 5000000 });
      const recordedChunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      const exportPromise = new Promise<string>((resolve, reject) => {
        recorder.onstop = () => {
          const fullBlob = new Blob(recordedChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(fullBlob);
          resolve(url);
        };
        recorder.onerror = (err) => reject(err);
      });

      recorder.start(100);
      await video.play();

      const startTime = shortClip.startTime;
      const totalDuration = shortClip.duration;

      // Frame rendering loop
      const renderFrame = () => {
        if (!isExporting) return;

        const currentAbs = video.currentTime;
        const clipRel = currentAbs - startTime;
        const progressPct = Math.min(100, Math.round((clipRel / totalDuration) * 100));
        setExportProgress(progressPct);

        // Apply color grading filters to context
        const { colorGrade } = shortClip;
        ctx.filter = `brightness(${colorGrade.brightness}) contrast(${colorGrade.contrast}) saturate(${colorGrade.saturate}) sepia(${colorGrade.sepia}) hue-rotate(${colorGrade.hueRotate}deg)`;

        // Draw video according to 9:16 layout
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        if (shortClip.layoutMode === 'center_crop') {
          const vWidth = video.videoWidth || 1920;
          const vHeight = video.videoHeight || 1080;
          const cropW = (vHeight * 9) / 16;
          const cropX = (vWidth - cropW) / 2;
          ctx.drawImage(video, cropX, 0, cropW, vHeight, 0, 0, width, height);
        } else if (shortClip.layoutMode === 'split_screen') {
          ctx.drawImage(video, 0, 0, width, height / 2);
          ctx.drawImage(video, 0, height / 2, width, height / 2);
        } else {
          // Blur padding
          const drawH = (width * 9) / 16;
          const drawY = (height - drawH) / 2;
          ctx.drawImage(video, 0, drawY, width, drawH);
        }

        ctx.filter = 'none';

        // Draw animated subtitles if active at this timestamp
        const activeSub = customConfig.enabled !== false
          ? shortClip.subtitles?.find((s) => clipRel >= s.start && clipRel <= s.end)
          : null;

        if (activeSub) {
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const fontSizePx = customConfig.fontSize === 'sm' ? 30 : customConfig.fontSize === 'md' ? 36 : customConfig.fontSize === 'lg' ? 42 : customConfig.fontSize === 'xl' ? 48 : 54;
          ctx.font = `900 ${fontSizePx}px ${customConfig.fontFamily || 'Montserrat'}, sans-serif`;

          const yPercent = customConfig.yOffsetPercent !== undefined ? customConfig.yOffsetPercent : (customConfig.position === 'top' ? 20 : customConfig.position === 'middle' ? 50 : 76);
          const textY = height * (yPercent / 100);

          const activeWord = activeSub.words?.find(
            (w) => clipRel >= w.start && clipRel <= w.end
          );

          // Draw subtitle container background
          const padding = 28;
          const textMetric = ctx.measureText(activeSub.text);
          const boxW = Math.min(width - 40, textMetric.width + padding * 2);
          const boxH = fontSizePx + 32;

          if (customConfig.backgroundStyle === 'box') {
            ctx.fillStyle = '#000000';
            ctx.fillRect(width / 2 - boxW / 2, textY - boxH / 2, boxW, boxH);
          } else if (customConfig.backgroundStyle === 'pill') {
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.roundRect(width / 2 - boxW / 2, textY - boxH / 2, boxW, boxH, 20);
            ctx.fill();
          } else if (customConfig.backgroundStyle === 'neon_outline') {
            ctx.fillStyle = 'rgba(0,0,0,0.85)';
            ctx.strokeStyle = customConfig.highlightColor;
            ctx.lineWidth = 3;
            ctx.roundRect(width / 2 - boxW / 2, textY - boxH / 2, boxW, boxH, 16);
            ctx.fill();
            ctx.stroke();
          }

          // Stroke setup
          if (customConfig.textShadow === 'heavy_stroke') {
            ctx.lineWidth = 6;
            ctx.strokeStyle = '#000000';
          }

          // Draw active word with highlight color or full line
          if (activeWord) {
            ctx.fillStyle = activeWord.highlight ? customConfig.highlightColor : customConfig.textColor;
            ctx.shadowColor = 'rgba(0,0,0,0.85)';
            ctx.shadowBlur = 8;
            const displayText = `${activeWord.emoji ? activeWord.emoji + ' ' : ''}${activeWord.word}`;
            if (customConfig.textShadow === 'heavy_stroke') {
              ctx.strokeText(displayText, width / 2, textY);
            }
            ctx.fillText(displayText, width / 2, textY);
          } else {
            ctx.fillStyle = customConfig.textColor;
            ctx.shadowColor = 'rgba(0,0,0,0.85)';
            ctx.shadowBlur = 8;
            if (customConfig.textShadow === 'heavy_stroke') {
              ctx.strokeText(activeSub.text, width / 2, textY);
            }
            ctx.fillText(activeSub.text, width / 2, textY);
          }

          ctx.restore();
        }

        if (currentAbs < shortClip.endTime && !video.paused && !video.ended) {
          requestAnimationFrame(renderFrame);
        } else {
          video.pause();
          recorder.stop();
        }
      };

      requestAnimationFrame(renderFrame);

      const generatedUrl = await exportPromise;
      setDownloadUrl(generatedUrl);
      setExportProgress(100);

      // Trigger victory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error('Export error:', err);
      setExportError(err.message || 'Failed to export video');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* Hidden elements for high quality rendering */}
      <video
        ref={hiddenVideoRef}
        src={videoSrc}
        crossOrigin="anonymous"
        muted
        playsInline
        className="hidden"
      />
      <canvas ref={hiddenCanvasRef} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-red-600" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">Export Viral 9:16 Short</h3>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          720x1280 (HD 9:16)
        </span>
      </div>

      {/* Summary info */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Short Duration:</span>
          <span className="font-mono text-slate-900 font-bold">{Math.round(shortClip.duration)} Seconds</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Color Grading LUT:</span>
          <span className="text-purple-700 font-bold uppercase">{shortClip.colorGrade.preset.replace('_', ' ')}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Subtitle Style:</span>
          <span className="text-blue-700 font-bold">{styleConfig.name}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Viral Prediction:</span>
          <span className="text-amber-700 font-bold">{shortClip.viralScore}/100 Score 🔥</span>
        </div>
      </div>

      {/* Progress or Actions */}
      {isExporting && (
        <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-2xl animate-pulse">
          <div className="flex items-center justify-between text-xs font-bold text-red-700">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Rendering 9:16 Canvas with Subtitles & LUT...
            </span>
            <span className="font-mono">{exportProgress}%</span>
          </div>
          <div className="w-full bg-red-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-150"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-red-600 text-center">
            Burning in timestamps, animations, and color matrix into high quality WebM video...
          </p>
        </div>
      )}

      {exportError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{exportError}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {downloadUrl ? (
          <a
            href={downloadUrl}
            download={`${shortClip.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_short.webm`}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition transform active:scale-95 text-center"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Download Completed 9:16 Video</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={handleRenderVideo}
            disabled={isExporting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-sm shadow-md shadow-red-600/25 flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>{isExporting ? 'Baking Video...' : 'Render & Export 9:16 Video (Burn Subtitles)'}</span>
          </button>
        )}

        {/* Download SRT subtitle button */}
        <button
          type="button"
          onClick={handleDownloadSRT}
          className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
        >
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Download .SRT Subtitle File Only</span>
        </button>
      </div>
    </div>
  );
};
