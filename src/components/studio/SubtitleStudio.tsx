import React, { useState } from 'react';
import { 
  Type, 
  Sparkles, 
  Plus, 
  Trash2, 
  Smile, 
  Wand2, 
  Check, 
  Layers, 
  MoveVertical,
  Clock,
  Sliders,
  Eye,
  EyeOff,
  Palette,
  Layout,
  Move
} from 'lucide-react';
import { 
  SubtitleLine, 
  SubtitleStyleName, 
  CustomSubtitleSettings,
  SubtitlePosition,
  SubtitleFontSize,
  SubtitleAnimation,
  SubtitleShadowStyle,
  SubtitleBgStyle
} from '../../types';
import { 
  SUBTITLE_STYLES, 
  getDefaultSubtitleConfig, 
  SUBTITLE_FONTS, 
  SUBTITLE_QUICK_COLORS 
} from '../../data/presets';

interface SubtitleStudioProps {
  subtitles: SubtitleLine[];
  onChangeSubtitles: (subtitles: SubtitleLine[]) => void;
  subtitleStyle: SubtitleStyleName;
  onChangeSubtitleStyle: (style: SubtitleStyleName) => void;
  subtitleCustom?: CustomSubtitleSettings;
  onChangeSubtitleCustom?: (custom: CustomSubtitleSettings) => void;
  currentTime: number;
  onSeekTo: (time: number) => void;
}

export const SubtitleStudio: React.FC<SubtitleStudioProps> = ({
  subtitles,
  onChangeSubtitles,
  subtitleStyle,
  onChangeSubtitleStyle,
  subtitleCustom,
  onChangeSubtitleCustom,
  currentTime,
  onSeekTo,
}) => {
  const [activeTab, setActiveTab] = useState<'customizer' | 'script'>('customizer');
  const [isPolishing, setIsPolishing] = useState(false);
  const quickEmojis = ['🔥', '🚀', '💡', '💰', '😱', '🛑', '⚡', '👑', '🎯', '❌', '💯', '✨'];

  const customConfig: CustomSubtitleSettings = subtitleCustom || getDefaultSubtitleConfig(subtitleStyle);

  const updateConfig = (partial: Partial<CustomSubtitleSettings>) => {
    const updated: CustomSubtitleSettings = {
      ...customConfig,
      ...partial,
    };
    if (onChangeSubtitleCustom) {
      onChangeSubtitleCustom(updated);
    }
  };

  // Handle word highlight toggle
  const toggleWordHighlight = (lineId: string, wordIdx: number) => {
    const updated = subtitles.map((line) => {
      if (line.id !== lineId) return line;
      const updatedWords = [...line.words];
      if (updatedWords[wordIdx]) {
        updatedWords[wordIdx] = {
          ...updatedWords[wordIdx],
          highlight: !updatedWords[wordIdx].highlight,
        };
      }
      return { ...line, words: updatedWords };
    });
    onChangeSubtitles(updated);
  };

  // Add emoji to active word
  const addEmojiToWord = (lineId: string, wordIdx: number, emoji: string) => {
    const updated = subtitles.map((line) => {
      if (line.id !== lineId) return line;
      const updatedWords = [...line.words];
      if (updatedWords[wordIdx]) {
        const currentEmoji = updatedWords[wordIdx].emoji;
        updatedWords[wordIdx] = {
          ...updatedWords[wordIdx],
          emoji: currentEmoji === emoji ? undefined : emoji,
          highlight: true,
        };
      }
      return { ...line, words: updatedWords };
    });
    onChangeSubtitles(updated);
  };

  // Update line text and auto-split words
  const updateLineText = (lineId: string, newText: string) => {
    const updated = subtitles.map((line) => {
      if (line.id !== lineId) return line;
      const wordsArr = newText.split(/\s+/).filter(Boolean);
      const lineDuration = Math.max(0.5, line.end - line.start);
      const wordDur = lineDuration / Math.max(1, wordsArr.length);

      const words = wordsArr.map((w, idx) => {
        const wStart = line.start + idx * wordDur;
        const wEnd = wStart + wordDur;
        const isCommonHighlight = ['secret', 'mistake', 'money', 'paisa', 'never', 'viral', 'stop', '10x', 'first'].some(
          (k) => w.toLowerCase().includes(k)
        );
        return {
          word: w,
          start: Number(wStart.toFixed(2)),
          end: Number(wEnd.toFixed(2)),
          highlight: isCommonHighlight,
        };
      });

      return { ...line, text: newText, words };
    });
    onChangeSubtitles(updated);
  };

  // Add new subtitle line
  const handleAddNewLine = () => {
    const lastLine = subtitles[subtitles.length - 1];
    const newStart = lastLine ? Number((lastLine.end + 0.1).toFixed(2)) : 0;
    const newEnd = Number((newStart + 2.5).toFixed(2));
    const newLine: SubtitleLine = {
      id: `line_${Date.now()}`,
      start: newStart,
      end: newEnd,
      text: 'New viral subtitle line',
      words: [
        { word: 'New', start: newStart, end: newStart + 0.8, highlight: false },
        { word: 'viral', start: newStart + 0.8, end: newStart + 1.6, highlight: true },
        { word: 'subtitle', start: newStart + 1.6, end: newEnd, highlight: false },
      ],
    };
    onChangeSubtitles([...subtitles, newLine]);
  };

  // Delete line
  const handleDeleteLine = (lineId: string) => {
    onChangeSubtitles(subtitles.filter((l) => l.id !== lineId));
  };

  // AI Subtitle Polish & Emoji Enhancer
  const handleAIPolish = async () => {
    setIsPolishing(true);
    try {
      const response = await fetch('/api/polish-subtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtitles }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.subtitles && Array.isArray(data.subtitles)) {
          onChangeSubtitles(data.subtitles);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* Top Header & Subtitle View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Subtitle Studio & Customization
            </h3>
            <p className="text-xs text-slate-500">
              Position, colors, font sizes aur word-by-word highlights live adjust karein.
            </p>
          </div>
        </div>

        {/* Tab switcher: Design Customizer vs Script Editor */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('customizer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'customizer'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Design & Position</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('script')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'script'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Script & Words ({subtitles.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: DESIGN & POSITION CUSTOMIZATION */}
      {activeTab === 'customizer' && (
        <div className="space-y-5">
          {/* Subtitle Enable / Visibility Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-900">Show Subtitles on Video:</span>
              <span className="text-xs text-slate-500">
                {customConfig.enabled !== false ? 'Enabled (दिख रहा है)' : 'Disabled (छुपा हुआ)'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => updateConfig({ enabled: customConfig.enabled === false ? true : false })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                customConfig.enabled !== false
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {customConfig.enabled !== false ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visible</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hidden</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Style Presets Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Choose Preset Starting Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {(Object.keys(SUBTITLE_STYLES) as SubtitleStyleName[]).map((styleKey) => {
                const style = SUBTITLE_STYLES[styleKey];
                const isSelected = subtitleStyle === styleKey;

                return (
                  <button
                    key={styleKey}
                    type="button"
                    onClick={() => {
                      onChangeSubtitleStyle(styleKey);
                      const def = getDefaultSubtitleConfig(styleKey);
                      updateConfig(def);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/90 ring-2 ring-blue-500/30'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">{style.name.split(' ')[0]}</div>
                    <div
                      className="mt-1.5 px-1 py-0.5 rounded text-[10px] font-black text-center border border-slate-200/50"
                      style={{
                        backgroundColor: style.backgroundColor || '#0f172a',
                        color: style.textColor,
                        textShadow: style.textShadow,
                      }}
                    >
                      <span style={{ color: style.highlightColor }}>VIRAL</span> HIT
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Position & Height Alignment Section */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-blue-600" />
                2. Subtitle Screen Position & Height
              </label>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                Height: {customConfig.yOffsetPercent}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Position buttons */}
              <div className="grid grid-cols-3 gap-2">
                {(['top', 'middle', 'bottom'] as SubtitlePosition[]).map((pos) => {
                  const isActive = customConfig.position === pos;
                  return (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => {
                        const y = pos === 'top' ? 18 : pos === 'middle' ? 52 : 78;
                        updateConfig({ position: pos, yOffsetPercent: y });
                      }}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm font-black'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pos}
                    </button>
                  );
                })}
              </div>

              {/* Slider */}
              <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Fine Slider:</span>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={customConfig.yOffsetPercent}
                  onChange={(e) => updateConfig({ yOffsetPercent: Number(e.target.value), position: 'custom' })}
                  className="flex-1 accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Typography & Size Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Font Family */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                3. Font Family
              </label>
              <select
                value={customConfig.fontFamily}
                onChange={(e) => updateConfig({ fontFamily: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {SUBTITLE_FONTS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                4. Font Size
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['sm', 'md', 'lg', 'xl', '2xl'] as SubtitleFontSize[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => updateConfig({ fontSize: sz })}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer ${
                      customConfig.fontSize === sz
                        ? 'bg-blue-600 text-white shadow-xs font-black'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Colors & Highlight Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Base Text Color */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                5. Main Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customConfig.textColor.startsWith('#') ? customConfig.textColor : '#FFFFFF'}
                  onChange={(e) => updateConfig({ textColor: e.target.value })}
                  className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0"
                />
                <div className="flex gap-1.5 flex-wrap flex-1">
                  {['#FFFFFF', '#F8FAFC', '#FEF3C7', '#F1F5F9'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => updateConfig({ textColor: c })}
                      className={`w-6 h-6 rounded-full border cursor-pointer transition ${
                        customConfig.textColor === c ? 'ring-2 ring-blue-500 scale-110' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Active Highlight Color */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                6. Viral Highlight Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customConfig.highlightColor}
                  onChange={(e) => updateConfig({ highlightColor: e.target.value })}
                  className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0"
                />
                <div className="flex gap-1.5 flex-wrap flex-1">
                  {SUBTITLE_QUICK_COLORS.slice(1).map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => updateConfig({ highlightColor: c.hex })}
                      className={`w-6 h-6 rounded-full border cursor-pointer transition ${
                        customConfig.highlightColor === c.hex ? 'ring-2 ring-blue-500 scale-110' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stroke, Shadow, Background & Animation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stroke / Shadow */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                7. Stroke & Shadow
              </label>
              <select
                value={customConfig.textShadow}
                onChange={(e) => updateConfig({ textShadow: e.target.value as SubtitleShadowStyle })}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="heavy_stroke">Heavy Black Stroke</option>
                <option value="soft_glow">Soft Glow Halo</option>
                <option value="drop_shadow">Subtle Drop Shadow</option>
                <option value="none">None (Clean Flat)</option>
              </select>
            </div>

            {/* Background Style */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                8. Background Backdrop
              </label>
              <select
                value={customConfig.backgroundStyle}
                onChange={(e) => updateConfig({ backgroundStyle: e.target.value as SubtitleBgStyle })}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="none">None (Transparent)</option>
                <option value="pill">Frosted Glass Pill</option>
                <option value="box">Solid Dark Box</option>
                <option value="neon_outline">Cyber Neon Outline</option>
              </select>
            </div>

            {/* Animation */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                9. Active Animation
              </label>
              <select
                value={customConfig.animation}
                onChange={(e) => updateConfig({ animation: e.target.value as SubtitleAnimation })}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="pop">Pop Zoom</option>
                <option value="bounce">Bouncy Trigger</option>
                <option value="glow">Glowing Word</option>
                <option value="fade">Smooth Fade</option>
                <option value="none">Static</option>
              </select>
            </div>
          </div>

          {/* Quick Preview Bar */}
          <div className="p-4 bg-slate-900 rounded-2xl flex items-center justify-between text-white shadow-inner">
            <div className="text-xs font-bold text-slate-400">Live Typography Preview:</div>
            <div
              className="px-4 py-1.5 rounded-xl font-black text-sm text-center"
              style={{
                fontFamily: customConfig.fontFamily,
                color: customConfig.textColor,
                backgroundColor: customConfig.backgroundStyle === 'box' ? '#000' : customConfig.backgroundStyle === 'pill' ? 'rgba(0,0,0,0.7)' : 'transparent',
                textTransform: customConfig.textTransform,
                textShadow: customConfig.textShadow === 'heavy_stroke' ? '2px 2px 0px #000, -2px -2px 0px #000' : 'none',
              }}
            >
              BUILD <span style={{ color: customConfig.highlightColor }}>VIRAL</span> SHORTS 🔥
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIMESTAMPED SCRIPT & WORDS EDITOR */}
      {activeTab === 'script' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Timestamped Dialogue & Interactive Words ({subtitles.length} lines)
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddNewLine}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-200"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>Add Line</span>
              </button>

              <button
                type="button"
                onClick={handleAIPolish}
                disabled={isPolishing}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isPolishing ? 'Polishing...' : 'AI Auto-Add Emojis'}</span>
              </button>
            </div>
          </div>

          <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
            {subtitles.map((line, lineIdx) => {
              const isCurrentlyPlaying = currentTime >= line.start && currentTime <= line.end;

              return (
                <div
                  key={line.id || lineIdx}
                  className={`p-4 rounded-2xl border transition ${
                    isCurrentlyPlaying
                      ? 'border-blue-500 bg-blue-50/70 ring-1 ring-blue-500/30 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                  }`}
                >
                  {/* Top: Timestamp, Seek & Delete button */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <button
                      type="button"
                      onClick={() => onSeekTo(line.start)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
                    >
                      <Clock className="w-3 h-3 text-blue-600" />
                      {line.start.toFixed(1)}s - {line.end.toFixed(1)}s
                      {isCurrentlyPlaying && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse ml-1" />
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Line #{lineIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteLine(line.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Words */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {line.words && line.words.map((w, wIdx) => {
                      const isWordActive =
                        currentTime >= w.start && currentTime <= w.end;

                      return (
                        <div key={wIdx} className="relative group/word inline-flex items-center">
                          <button
                            type="button"
                            onClick={() => toggleWordHighlight(line.id, wIdx)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-black transition border flex items-center gap-1 cursor-pointer ${
                              w.highlight
                                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                                : isWordActive
                                ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400/40'
                                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {w.emoji && <span>{w.emoji}</span>}
                            <span>{w.word}</span>
                          </button>

                          {/* Quick emoji popover on hover */}
                          <div className="hidden group-hover/word:flex absolute -top-8 left-0 z-30 bg-white border border-slate-200 rounded-xl p-1 shadow-lg items-center gap-1">
                            {quickEmojis.slice(0, 6).map((em) => (
                              <button
                                key={em}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addEmojiToWord(line.id, wIdx, em);
                                }}
                                className="text-xs hover:scale-125 transition p-0.5"
                              >
                                {em}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Editable Raw Text */}
                  <input
                    type="text"
                    value={line.text}
                    onChange={(e) => updateLineText(line.id, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
