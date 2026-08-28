import { ColorGradingConfig, ColorPresetName, SubtitleStyleName } from '../types';

export const COLOR_PRESETS: Record<ColorPresetName, { name: string; description: string; previewColor: string; config: ColorGradingConfig }> = {
  teal_orange: {
    name: 'Teal & Orange Blockbuster',
    description: 'Cinematic Hollywood contrast with rich warm skin tones and deep cool shadows.',
    previewColor: 'from-amber-500 to-cyan-700',
    config: {
      preset: 'teal_orange',
      brightness: 1.05,
      contrast: 1.25,
      saturate: 1.35,
      warmth: 18,
      sepia: 0.1,
      hueRotate: -4,
      vignette: 0.35,
      grain: 0.12,
      gamma: 1.02,
    },
  },
  cinematic_dark: {
    name: 'Moody Dark Noir',
    description: 'High contrast, dramatic deep blacks, and muted modern film tones.',
    previewColor: 'from-slate-900 via-neutral-800 to-zinc-900',
    config: {
      preset: 'cinematic_dark',
      brightness: 0.92,
      contrast: 1.4,
      saturate: 0.85,
      warmth: -6,
      sepia: 0.05,
      hueRotate: 0,
      vignette: 0.55,
      grain: 0.22,
      gamma: 0.95,
    },
  },
  vibrant_pop: {
    name: 'Viral Pop & Glow',
    description: 'Punchy saturation, clean whites, and high dynamic range for instant phone eye-catch.',
    previewColor: 'from-rose-500 via-purple-500 to-amber-400',
    config: {
      preset: 'vibrant_pop',
      brightness: 1.08,
      contrast: 1.2,
      saturate: 1.5,
      warmth: 8,
      sepia: 0,
      hueRotate: 2,
      vignette: 0.15,
      grain: 0.05,
      gamma: 1.05,
    },
  },
  vintage_warm: {
    name: 'Kodak 35mm Vintage',
    description: 'Analog film warmth, soft highlights, and retro nostalgic indie vibe.',
    previewColor: 'from-amber-600 to-yellow-700',
    config: {
      preset: 'vintage_warm',
      brightness: 1.02,
      contrast: 1.15,
      saturate: 1.15,
      warmth: 32,
      sepia: 0.28,
      hueRotate: -8,
      vignette: 0.4,
      grain: 0.3,
      gamma: 1.0,
    },
  },
  golden_hour: {
    name: 'Golden Hour Luxury',
    description: 'Sun-drenched golden glow, flattering portraits, and rich luxury undertones.',
    previewColor: 'from-yellow-500 to-orange-600',
    config: {
      preset: 'golden_hour',
      brightness: 1.06,
      contrast: 1.18,
      saturate: 1.25,
      warmth: 40,
      sepia: 0.18,
      hueRotate: -12,
      vignette: 0.25,
      grain: 0.08,
      gamma: 1.03,
    },
  },
  cyber_neon: {
    name: 'Cyberpunk Neon Matrix',
    description: 'Futuristic electric shadows, sharp highlights, and tech aesthetic.',
    previewColor: 'from-fuchsia-600 via-indigo-600 to-cyan-500',
    config: {
      preset: 'cyber_neon',
      brightness: 1.0,
      contrast: 1.35,
      saturate: 1.45,
      warmth: -20,
      sepia: 0,
      hueRotate: 25,
      vignette: 0.45,
      grain: 0.18,
      gamma: 0.98,
    },
  },
  studio_clean: {
    name: 'Studio HDR Crisp',
    description: 'Natural high clarity, balanced skin tones, and professional clean podcast look.',
    previewColor: 'from-blue-400 to-emerald-400',
    config: {
      preset: 'studio_clean',
      brightness: 1.03,
      contrast: 1.12,
      saturate: 1.1,
      warmth: 0,
      sepia: 0,
      hueRotate: 0,
      vignette: 0.1,
      grain: 0.02,
      gamma: 1.0,
    },
  },
  black_white: {
    name: 'High-Impact Monochrome',
    description: 'Deep artistic black and white with punchy silver highlights and deep shadows.',
    previewColor: 'from-zinc-950 to-zinc-400',
    config: {
      preset: 'black_white',
      brightness: 1.0,
      contrast: 1.45,
      saturate: 0,
      warmth: 0,
      sepia: 0,
      hueRotate: 0,
      vignette: 0.45,
      grain: 0.25,
      gamma: 0.96,
    },
  },
  bleach_bypass: {
    name: 'Bleach Bypass Action',
    description: 'Desaturated tones with hyper-sharp edge contrast for action and tension.',
    previewColor: 'from-stone-800 to-stone-500',
    config: {
      preset: 'bleach_bypass',
      brightness: 0.95,
      contrast: 1.45,
      saturate: 0.6,
      warmth: -10,
      sepia: 0.08,
      hueRotate: 0,
      vignette: 0.4,
      grain: 0.2,
      gamma: 0.94,
    },
  },
};

export interface SubtitleStyleConfig {
  name: string;
  description: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  highlightColor: string;
  backgroundColor?: string;
  textShadow?: string;
  borderStroke?: string;
  textTransform?: 'uppercase' | 'none' | 'capitalize';
  animation: 'pop' | 'glow' | 'bounce' | 'slide' | 'fade';
  position: 'bottom' | 'middle' | 'top';
}

export const SUBTITLE_STYLES: Record<SubtitleStyleName, SubtitleStyleConfig> = {
  hormozi: {
    name: 'Alex Hormozi Viral Pop',
    description: 'Heavy bold uppercase typography, yellow/green keyword pop with deep black text stroke.',
    fontFamily: '"Impact", "Arial Black", sans-serif',
    fontSize: 'text-2xl sm:text-3xl font-black tracking-tight',
    textColor: '#FFFFFF',
    highlightColor: '#FACC15', // Vibrant Yellow
    textShadow: '3px 3px 0px #000, -3px -3px 0px #000, 3px -3px 0px #000, -3px 3px 0px #000, 0px 6px 12px rgba(0,0,0,0.8)',
    borderStroke: '3px solid black',
    textTransform: 'uppercase',
    animation: 'pop',
    position: 'middle',
  },
  mrbeast: {
    name: 'MrBeast Energy Glow',
    description: 'High energy slanted bold text with bright neon backing and bouncy keyword triggers.',
    fontFamily: '"Montserrat", "Arial Black", sans-serif',
    fontSize: 'text-2xl sm:text-3xl font-extrabold italic tracking-wide',
    textColor: '#FFFFFF',
    highlightColor: '#38BDF8', // Cyan Glow
    backgroundColor: 'rgba(0,0,0,0.75)',
    textShadow: '0 0 20px rgba(56, 189, 248, 0.8), 2px 2px 4px rgba(0,0,0,0.9)',
    textTransform: 'uppercase',
    animation: 'bounce',
    position: 'middle',
  },
  karaoke: {
    name: 'Karaoke Real-Time Wave',
    description: 'Smooth glowing word-by-word active highlight synced accurately with real speech.',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 'text-xl sm:text-2xl font-bold',
    textColor: 'rgba(255,255,255,0.65)',
    highlightColor: '#4ADE80', // Neon Emerald
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
    textTransform: 'none',
    animation: 'glow',
    position: 'bottom',
  },
  minimal: {
    name: 'Cinematic Minimalist Pill',
    description: 'Clean Apple-style typography enclosed in a frosted glass dark pill backdrop.',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 'text-lg sm:text-xl font-medium tracking-normal',
    textColor: '#F8FAFC',
    highlightColor: '#60A5FA', // Sky Blue
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textTransform: 'none',
    animation: 'fade',
    position: 'bottom',
  },
  cyberpunk: {
    name: 'Cyberpunk Glitch Neon',
    description: 'Edgy futuristic styling with magenta/cyan split neon and high adrenaline.',
    fontFamily: '"Courier New", monospace, sans-serif',
    fontSize: 'text-xl sm:text-2xl font-black tracking-widest',
    textColor: '#F43F5E',
    highlightColor: '#06B6D4',
    backgroundColor: 'rgba(10, 10, 20, 0.9)',
    textShadow: '0 0 10px #F43F5E, 0 0 20px #06B6D4',
    textTransform: 'uppercase',
    animation: 'pop',
    position: 'middle',
  },
  aesthetic_warm: {
    name: 'Warm Aesthetic Script',
    description: 'Elegant warm cream typography with soft gold highlights for lifestyle, vlogs & calm advice.',
    fontFamily: 'Georgia, serif',
    fontSize: 'text-xl sm:text-2xl font-semibold italic',
    textColor: '#FEF3C7',
    highlightColor: '#F59E0B',
    backgroundColor: 'rgba(28, 25, 23, 0.65)',
    textShadow: '0 2px 6px rgba(0,0,0,0.7)',
    textTransform: 'none',
    animation: 'fade',
    position: 'bottom',
  },
};

import { CustomSubtitleSettings } from '../types';

export function getDefaultSubtitleConfig(styleName: SubtitleStyleName = 'hormozi'): CustomSubtitleSettings {
  switch (styleName) {
    case 'hormozi':
      return {
        enabled: true,
        position: 'middle',
        yOffsetPercent: 52,
        fontFamily: '"Impact", "Arial Black", sans-serif',
        fontSize: '2xl',
        textColor: '#FFFFFF',
        highlightColor: '#FACC15',
        backgroundColor: 'transparent',
        backgroundStyle: 'none',
        textTransform: 'uppercase',
        textShadow: 'heavy_stroke',
        animation: 'pop',
        wordsPerLine: 'few',
        autoEmojis: true,
      };
    case 'mrbeast':
      return {
        enabled: true,
        position: 'middle',
        yOffsetPercent: 50,
        fontFamily: '"Montserrat", "Arial Black", sans-serif',
        fontSize: '2xl',
        textColor: '#FFFFFF',
        highlightColor: '#38BDF8',
        backgroundColor: 'rgba(0,0,0,0.75)',
        backgroundStyle: 'box',
        textTransform: 'uppercase',
        textShadow: 'soft_glow',
        animation: 'bounce',
        wordsPerLine: 'few',
        autoEmojis: true,
      };
    case 'karaoke':
      return {
        enabled: true,
        position: 'bottom',
        yOffsetPercent: 78,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: 'xl',
        textColor: '#CBD5E1',
        highlightColor: '#4ADE80',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backgroundStyle: 'pill',
        textTransform: 'none',
        textShadow: 'drop_shadow',
        animation: 'glow',
        wordsPerLine: 'auto',
        autoEmojis: false,
      };
    case 'minimal':
      return {
        enabled: true,
        position: 'bottom',
        yOffsetPercent: 80,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: 'lg',
        textColor: '#F8FAFC',
        highlightColor: '#60A5FA',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backgroundStyle: 'pill',
        textTransform: 'none',
        textShadow: 'none',
        animation: 'fade',
        wordsPerLine: 'auto',
        autoEmojis: false,
      };
    case 'cyberpunk':
      return {
        enabled: true,
        position: 'middle',
        yOffsetPercent: 50,
        fontFamily: '"Courier New", monospace, sans-serif',
        fontSize: 'xl',
        textColor: '#F43F5E',
        highlightColor: '#06B6D4',
        backgroundColor: 'rgba(10, 10, 20, 0.9)',
        backgroundStyle: 'neon_outline',
        textTransform: 'uppercase',
        textShadow: 'soft_glow',
        animation: 'pop',
        wordsPerLine: 'few',
        autoEmojis: true,
      };
    case 'aesthetic_warm':
      return {
        enabled: true,
        position: 'bottom',
        yOffsetPercent: 76,
        fontFamily: 'Georgia, serif',
        fontSize: 'xl',
        textColor: '#FEF3C7',
        highlightColor: '#F59E0B',
        backgroundColor: 'rgba(28, 25, 23, 0.65)',
        backgroundStyle: 'pill',
        textTransform: 'none',
        textShadow: 'drop_shadow',
        animation: 'fade',
        wordsPerLine: 'auto',
        autoEmojis: false,
      };
    default:
      return {
        enabled: true,
        position: 'middle',
        yOffsetPercent: 52,
        fontFamily: '"Impact", "Arial Black", sans-serif',
        fontSize: '2xl',
        textColor: '#FFFFFF',
        highlightColor: '#FACC15',
        backgroundColor: 'transparent',
        backgroundStyle: 'none',
        textTransform: 'uppercase',
        textShadow: 'heavy_stroke',
        animation: 'pop',
        wordsPerLine: 'few',
        autoEmojis: true,
      };
  }
}

export const SUBTITLE_FONTS = [
  { id: '"Impact", "Arial Black", sans-serif', label: 'Impact (Viral Heavy)', sample: 'VIRAL' },
  { id: '"Montserrat", "Arial Black", sans-serif', label: 'Montserrat Bold', sample: 'BOLD' },
  { id: 'system-ui, -apple-system, sans-serif', label: 'Modern Clean Sans', sample: 'Modern' },
  { id: '"Bebas Neue", "Impact", sans-serif', label: 'Bebas Condensed', sample: 'PUNCH' },
  { id: 'Georgia, serif', label: 'Georgia Serif Elegant', sample: 'Story' },
  { id: '"Courier New", monospace', label: 'Retro Monospace', sample: 'CODE' },
];

export const SUBTITLE_QUICK_COLORS = [
  { hex: '#FFFFFF', label: 'White' },
  { hex: '#FACC15', label: 'Electric Yellow' },
  { hex: '#4ADE80', label: 'Neon Lime' },
  { hex: '#38BDF8', label: 'Sky Cyan' },
  { hex: '#F43F5E', label: 'Hot Pink' },
  { hex: '#FB923C', label: 'Vibrant Orange' },
  { hex: '#A855F7', label: 'Neon Purple' },
];
