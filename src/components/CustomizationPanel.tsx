import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Clock, 
  Layers, 
  Type, 
  Palette, 
  Languages, 
  Layout, 
  Flame, 
  Zap, 
  Check,
  Settings2,
  Smile,
  MoveVertical
} from 'lucide-react';
import { 
  AnalysisSettings, 
  FocusTone, 
  SubtitleStyleName, 
  ColorPresetName, 
  LayoutMode,
  CustomSubtitleSettings,
  SubtitlePosition,
  SubtitleFontSize,
  SubtitleAnimation
} from '../types';
import { COLOR_PRESETS, SUBTITLE_STYLES, getDefaultSubtitleConfig, SUBTITLE_FONTS, SUBTITLE_QUICK_COLORS } from '../data/presets';

interface CustomizationPanelProps {
  settings: AnalysisSettings;
  onChangeSettings: (settings: AnalysisSettings) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  settings,
  onChangeSettings,
  onGenerate,
  isGenerating,
  disabled,
}) => {
  const [activeSubtitleTab, setActiveSubtitleTab] = useState<'preset' | 'custom'>('preset');
  const durationOptions = [15, 30, 45, 60];

  const currentCustomSubs: CustomSubtitleSettings = settings.subtitleCustom || getDefaultSubtitleConfig(settings.subtitleStyle);

  const handleUpdateCustomSubs = (partial: Partial<CustomSubtitleSettings>) => {
    const updated: CustomSubtitleSettings = {
      ...currentCustomSubs,
      ...partial,
    };
    onChangeSettings({
      ...settings,
      subtitleCustom: updated,
    });
  };

  const focusTones: { id: FocusTone; label: string; icon: string; desc: string }[] = [
    { id: 'viral_hook', label: 'Viral Hook & Mystery', icon: '🔥', desc: 'Curiosity gap & instant retention' },
    { id: 'high_energy', label: 'High Energy & Action', icon: '⚡', desc: 'Fast paced, punchy cuts' },
    { id: 'storytelling', label: 'Story & Emotion', icon: '📖', desc: 'Climax & emotional arc' },
    { id: 'knowledge_bomb', label: 'Value & Insights', icon: '💡', desc: 'High-density golden advice' },
    { id: 'controversy_debate', label: 'Debate & Hot Takes', icon: '🎙️', desc: 'Engaging debates & opinions' },
    { id: 'actionable_tip', label: 'Actionable Step-by-Step', icon: '🎯', desc: 'How-to & direct takeaways' },
  ];

  const layoutModes: { id: LayoutMode; label: string; desc: string }[] = [
    { id: 'center_crop', label: 'Smart 9:16 Crop', desc: 'Auto-centers main subject/speaker' },
    { id: 'split_screen', label: 'Podcast Split Screen', desc: 'Top host & bottom guest/reaction' },
    { id: 'blur_padding', label: 'Blurred Backdrop', desc: 'Keeps 16:9 intact with glowing blur' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-500" />
            2. Shorts Duration & Subtitle Customization
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Set length, pick viral hooks, customize subtitle position & colors, and choose cinematic color grade.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Duration, Count & Virality Tone */}
        <div className="space-y-5">
          {/* Target Short Duration */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-600" />
                Target Short Length (Duration)
              </span>
              <span className="text-red-600 font-bold text-sm">{settings.targetDuration}s per Short</span>
            </label>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {durationOptions.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onChangeSettings({ ...settings, targetDuration: sec })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                    settings.targetDuration === sec
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{sec}s</span>
                  <span className="text-[10px] font-normal opacity-85">
                    {sec === 15 ? 'Quick Hit' : sec === 30 ? 'Viral Reel' : sec === 45 ? 'Deep Dive' : 'Story'}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom slider */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500">Custom Slider:</span>
              <input
                type="range"
                min={10}
                max={90}
                step={5}
                value={settings.targetDuration}
                onChange={(e) => onChangeSettings({ ...settings, targetDuration: Number(e.target.value) })}
                className="flex-1 accent-red-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <span className="text-xs font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-xs">
                {settings.targetDuration}s
              </span>
            </div>
          </div>

          {/* Number of Shorts to extract */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                How Many Shorts To Generate?
              </span>
              <span className="text-amber-700 font-bold text-sm">{settings.numberOfShorts} Shorts</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onChangeSettings({ ...settings, numberOfShorts: num })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    settings.numberOfShorts === num
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {num} {num === 1 ? 'Short' : 'Shorts'}
                </button>
              ))}
            </div>
          </div>

          {/* Virality Focus Tone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-600" />
              Virality & Content Tone
            </label>
            <div className="grid grid-cols-2 gap-2">
              {focusTones.map((tone) => {
                const isSelected = settings.focusTone === tone.id;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => onChangeSettings({ ...settings, focusTone: tone.id })}
                    className={`p-2.5 rounded-2xl border text-left transition flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-red-500 bg-red-50 ring-1 ring-red-500/30'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-base">{tone.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{tone.label}</div>
                      <div className="text-[10px] text-slate-500 leading-tight">{tone.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Subtitles, Color Grading & Framing */}
        <div className="space-y-5">
          {/* Subtitle Customization Section */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Subtitle Customization (सब-टाइटल कस्टमाइज़ेशन)
                </span>
              </div>
              <div className="flex bg-slate-200/80 p-0.5 rounded-lg border border-slate-300">
                <button
                  type="button"
                  onClick={() => setActiveSubtitleTab('preset')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                    activeSubtitleTab === 'preset'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Presets
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubtitleTab('custom')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    activeSubtitleTab === 'custom'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Settings2 className="w-3 h-3" />
                  Custom
                </button>
              </div>
            </div>

            {/* Subtitle Presets Tab */}
            {activeSubtitleTab === 'preset' && (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(SUBTITLE_STYLES) as SubtitleStyleName[]).map((styleKey) => {
                    const style = SUBTITLE_STYLES[styleKey];
                    const isSelected = settings.subtitleStyle === styleKey;
                    return (
                      <button
                        key={styleKey}
                        type="button"
                        onClick={() => {
                          const defConfig = getDefaultSubtitleConfig(styleKey);
                          onChangeSettings({
                            ...settings,
                            subtitleStyle: styleKey,
                            subtitleCustom: defConfig,
                          });
                        }}
                        className={`p-2 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/80 ring-1 ring-blue-500/30'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-[11px] font-bold text-slate-900 line-clamp-1">{style.name.split(' ')[0]}</div>
                        <div
                          className="mt-1.5 px-1 py-0.5 rounded text-[9px] font-black text-center border border-slate-200/50"
                          style={{
                            backgroundColor: style.backgroundColor || '#0f172a',
                            color: style.textColor,
                            textShadow: style.textShadow,
                          }}
                        >
                          <span style={{ color: style.highlightColor }}>VIRAL</span> POP
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Advanced Subtitle Customization Tab */}
            {activeSubtitleTab === 'custom' && (
              <div className="space-y-3 pt-1">
                {/* 1. Subtitle Position & Height */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Position on Screen
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['top', 'middle', 'bottom'] as SubtitlePosition[]).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => {
                            const y = pos === 'top' ? 18 : pos === 'middle' ? 52 : 78;
                            handleUpdateCustomSubs({ position: pos, yOffsetPercent: y });
                          }}
                          className={`py-1 rounded-lg text-[11px] font-bold uppercase transition cursor-pointer ${
                            currentCustomSubs.position === pos
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex justify-between">
                      <span>Height (Y-Offset)</span>
                      <span className="font-mono text-blue-600">{currentCustomSubs.yOffsetPercent}%</span>
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={90}
                      value={currentCustomSubs.yOffsetPercent}
                      onChange={(e) => handleUpdateCustomSubs({ yOffsetPercent: Number(e.target.value), position: 'custom' })}
                      className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg mt-1"
                    />
                  </div>
                </div>

                {/* 2. Font Family & Font Size */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Font Typography
                    </label>
                    <select
                      value={currentCustomSubs.fontFamily}
                      onChange={(e) => handleUpdateCustomSubs({ fontFamily: e.target.value })}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                    >
                      {SUBTITLE_FONTS.map((f) => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Font Size
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {(['sm', 'md', 'lg', '2xl'] as SubtitleFontSize[]).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleUpdateCustomSubs({ fontSize: sz })}
                          className={`py-1 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                            currentCustomSubs.fontSize === sz
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Text & Highlight Colors */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Text Base Color
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={currentCustomSubs.textColor.startsWith('#') ? currentCustomSubs.textColor : '#FFFFFF'}
                        onChange={(e) => handleUpdateCustomSubs({ textColor: e.target.value })}
                        className="w-6 h-6 rounded border border-slate-300 cursor-pointer p-0"
                      />
                      <div className="flex gap-1 flex-1">
                        {['#FFFFFF', '#F8FAFC', '#FEF3C7'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleUpdateCustomSubs({ textColor: c })}
                            className="w-5 h-5 rounded-full border border-slate-300 cursor-pointer"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Active Highlight Color
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={currentCustomSubs.highlightColor}
                        onChange={(e) => handleUpdateCustomSubs({ highlightColor: e.target.value })}
                        className="w-6 h-6 rounded border border-slate-300 cursor-pointer p-0"
                      />
                      <div className="flex gap-1 flex-1">
                        {['#FACC15', '#4ADE80', '#38BDF8', '#F43F5E'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleUpdateCustomSubs({ highlightColor: c })}
                            className="w-5 h-5 rounded-full border border-slate-300 cursor-pointer"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Animation & Background */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Animation Effect
                    </label>
                    <select
                      value={currentCustomSubs.animation}
                      onChange={(e) => handleUpdateCustomSubs({ animation: e.target.value as SubtitleAnimation })}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                    >
                      <option value="pop">Pop Scale Zoom</option>
                      <option value="bounce">Bouncy Trigger</option>
                      <option value="glow">Glowing Wave</option>
                      <option value="fade">Smooth Fade</option>
                      <option value="none">Static (No Motion)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Background Style
                    </label>
                    <select
                      value={currentCustomSubs.backgroundStyle}
                      onChange={(e) => handleUpdateCustomSubs({ backgroundStyle: e.target.value as any })}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                    >
                      <option value="none">None (Transparent Stroke)</option>
                      <option value="pill">Dark Glass Pill</option>
                      <option value="box">Solid Black Box</option>
                      <option value="neon_outline">Neon Cyber Glow</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Live Subtitle Mini Badge Preview */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Live Subtitle Look:</span>
              <div
                className="px-3 py-1 rounded-lg text-xs font-black shadow-xs"
                style={{
                  fontFamily: currentCustomSubs.fontFamily,
                  color: currentCustomSubs.textColor,
                  backgroundColor: currentCustomSubs.backgroundStyle === 'box' ? '#0f172a' : currentCustomSubs.backgroundStyle === 'pill' ? 'rgba(0,0,0,0.7)' : '#000',
                  textTransform: currentCustomSubs.textTransform,
                  textShadow: currentCustomSubs.textShadow === 'heavy_stroke' ? '2px 2px 0px #000, -2px -2px 0px #000' : 'none',
                }}
              >
                THIS IS <span style={{ color: currentCustomSubs.highlightColor }}>VIRAL</span> HOOK 🔥
              </div>
            </div>
          </div>

          {/* Color Grading Preset */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-600" />
                Cinematic Color Grading (LUT)
              </span>
              <span className="text-[11px] text-purple-600 font-semibold">
                {COLOR_PRESETS[settings.colorGradePreset]?.name}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(COLOR_PRESETS) as ColorPresetName[]).slice(0, 6).map((presetKey) => {
                const preset = COLOR_PRESETS[presetKey];
                const isSelected = settings.colorGradePreset === presetKey;
                return (
                  <button
                    key={presetKey}
                    type="button"
                    onClick={() => onChangeSettings({ ...settings, colorGradePreset: presetKey })}
                    className={`p-2 rounded-2xl border text-left transition relative overflow-hidden group cursor-pointer ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500/30'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`h-3.5 w-full rounded-lg bg-gradient-to-r ${preset.previewColor} mb-1.5 opacity-90`} />
                    <div className="text-[11px] font-bold text-slate-900 line-clamp-1">{preset.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language & Framing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Language */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                <Languages className="w-3 h-3 text-slate-500" />
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => onChangeSettings({ ...settings, language: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-red-500 focus:bg-white cursor-pointer"
              >
                <option value="auto">Auto Detect Language</option>
                <option value="hinglish">Hinglish (Hindi + English)</option>
                <option value="hindi">Hindi (हिंदी)</option>
                <option value="english">English</option>
                <option value="urdu">Urdu (اردو)</option>
              </select>
            </div>

            {/* Smart Framing */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                <Layout className="w-3 h-3 text-slate-500" />
                9:16 Framing
              </label>
              <select
                value={settings.smartFraming}
                onChange={(e) => onChangeSettings({ ...settings, smartFraming: e.target.value as any })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-red-500 focus:bg-white cursor-pointer"
              >
                {layoutModes.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>
            AI will deeply analyze viral peaks, transcribe exact words, apply color grading, and extract{' '}
            <strong className="text-slate-900">{settings.numberOfShorts} Shorts</strong> of ~{settings.targetDuration}s
            each.
          </span>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          disabled={disabled || isGenerating}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-red-600/25 flex items-center justify-center gap-2.5 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Analyzing Video & Generating Shorts...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Generate Viral Shorts with AI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
