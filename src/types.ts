export type VideoSourceType = 'youtube' | 'upload' | 'sample';

export interface VideoSource {
  id: string;
  type: VideoSourceType;
  title: string;
  url?: string;
  videoUrl?: string; // Direct playable URL or object URL
  duration: number; // In seconds
  thumbnailUrl?: string;
  author?: string;
  description?: string;
  file?: File;
  rawTranscript?: string;
}

export type FocusTone = 
  | 'viral_hook' 
  | 'high_energy' 
  | 'storytelling' 
  | 'knowledge_bomb' 
  | 'controversy_debate' 
  | 'actionable_tip' 
  | 'comedy_humor';

export type SubtitleStyleName = 
  | 'hormozi' 
  | 'mrbeast' 
  | 'karaoke' 
  | 'minimal' 
  | 'cyberpunk' 
  | 'aesthetic_warm';

export type ColorPresetName = 
  | 'teal_orange' 
  | 'cinematic_dark' 
  | 'vibrant_pop' 
  | 'vintage_warm' 
  | 'golden_hour' 
  | 'cyber_neon' 
  | 'studio_clean' 
  | 'black_white' 
  | 'bleach_bypass';

export type LayoutMode = 'center_crop' | 'split_screen' | 'blur_padding' | 'fit_letterbox';

export type SubtitlePosition = 'top' | 'middle' | 'bottom' | 'custom';
export type SubtitleFontSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type SubtitleAnimation = 'pop' | 'glow' | 'bounce' | 'slide' | 'fade' | 'none';
export type SubtitleTextTransform = 'uppercase' | 'none' | 'capitalize';
export type SubtitleShadowStyle = 'heavy_stroke' | 'soft_glow' | 'drop_shadow' | 'none';
export type SubtitleBgStyle = 'none' | 'pill' | 'box' | 'neon_outline';

export interface CustomSubtitleSettings {
  enabled: boolean;
  position: SubtitlePosition;
  yOffsetPercent: number; // 10% to 90% (e.g., 20 is top, 50 is center, 80 is bottom)
  fontFamily: string;
  fontSize: SubtitleFontSize;
  textColor: string;
  highlightColor: string;
  backgroundColor: string;
  backgroundStyle: SubtitleBgStyle;
  textTransform: SubtitleTextTransform;
  textShadow: SubtitleShadowStyle;
  animation: SubtitleAnimation;
  wordsPerLine: 'single' | 'few' | 'auto';
  autoEmojis: boolean;
}

export interface AnalysisSettings {
  targetDuration: number; // 15, 30, 45, 60, or custom (e.g. 20)
  numberOfShorts: number; // 1 to 5
  focusTone: FocusTone;
  language: 'auto' | 'hindi' | 'hinglish' | 'english' | 'urdu';
  subtitleStyle: SubtitleStyleName;
  subtitleCustom?: CustomSubtitleSettings;
  colorGradePreset: ColorPresetName;
  smartFraming: LayoutMode;
  autoEmojis: boolean;
  highlightKeywords: boolean;
}

export interface SubtitleWord {
  word: string;
  start: number; // seconds
  end: number; // seconds
  highlight?: boolean;
  color?: string;
  emoji?: string;
}

export interface SubtitleLine {
  id: string;
  start: number; // seconds
  end: number; // seconds
  text: string;
  words: SubtitleWord[];
  speaker?: string;
}

export interface ColorGradingConfig {
  preset: ColorPresetName;
  brightness: number; // 0.6 - 1.4 (default 1.0)
  contrast: number;   // 0.7 - 1.6 (default 1.15)
  saturate: number;   // 0.4 - 2.0 (default 1.25)
  warmth: number;     // -50 to 50 (default 10)
  sepia: number;      // 0 to 1 (default 0)
  hueRotate: number;  // -30 to 30 deg (default 0)
  vignette: number;   // 0 to 1 (default 0.25)
  grain: number;      // 0 to 1 (default 0.15)
  gamma: number;      // 0.8 - 1.2 (default 1.0)
}

export interface ShortClip {
  id: string;
  title: string;
  hookHeadline: string;
  hookSummary: string;
  viralScore: number; // 0 - 100
  scoreBreakdown: {
    hookStrength: number; // 0 - 100
    retentionPotential: number; // 0 - 100
    pacingQuality: number; // 0 - 100
    audioClarity: number; // 0 - 100
  };
  startTime: number; // in seconds
  endTime: number; // in seconds
  duration: number; // in seconds
  subtitles: SubtitleLine[];
  subtitleCustom?: CustomSubtitleSettings;
  colorGrade: ColorGradingConfig;
  layoutMode: LayoutMode;
  hashtags: string[];
  viralDescription: string;
  targetPlatform: 'youtube_shorts' | 'instagram_reels' | 'tiktok';
  keyTakeaways: string[];
}

export interface VideoAnalysisResult {
  videoId: string;
  videoTitle: string;
  totalDuration: number;
  overallSummary: string;
  shorts: ShortClip[];
  detectedLanguage: string;
  analyzedAt: string;
}
