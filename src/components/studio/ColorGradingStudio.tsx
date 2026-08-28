import React from 'react';
import { Palette, Sliders, Sun, Contrast, Droplet, Flame, Sparkles, RefreshCw, Eye } from 'lucide-react';
import { ColorGradingConfig, ColorPresetName } from '../../types';
import { COLOR_PRESETS } from '../../data/presets';

interface ColorGradingStudioProps {
  colorGrade: ColorGradingConfig;
  onChangeColorGrade: (config: ColorGradingConfig) => void;
}

export const ColorGradingStudio: React.FC<ColorGradingStudioProps> = ({
  colorGrade,
  onChangeColorGrade,
}) => {
  const handleSelectPreset = (presetKey: ColorPresetName) => {
    const preset = COLOR_PRESETS[presetKey];
    if (preset) {
      onChangeColorGrade({ ...preset.config });
    }
  };

  const handleReset = () => {
    onChangeColorGrade({
      preset: 'teal_orange',
      brightness: 1.0,
      contrast: 1.0,
      saturate: 1.0,
      warmth: 0,
      sepia: 0,
      hueRotate: 0,
      vignette: 0,
      grain: 0,
      gamma: 1.0,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">Cinematic Color Grading & LUTs</h3>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          Reset Neutral
        </button>
      </div>

      {/* Preset Gallery */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Choose Cinematic Preset
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {(Object.keys(COLOR_PRESETS) as ColorPresetName[]).map((key) => {
            const preset = COLOR_PRESETS[key];
            const isSelected = colorGrade.preset === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPreset(key)}
                className={`p-3 rounded-2xl border text-left transition relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/30'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className={`h-4 w-full rounded-lg bg-gradient-to-r ${preset.previewColor} mb-2 shadow-xs`} />
                <div className="text-xs font-bold text-slate-900 line-clamp-1">{preset.name}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{preset.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Precision Sliders */}
      <div className="space-y-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-600" />
            Fine-Tune Color Wheels & Curves
          </label>
          <span className="text-[11px] text-purple-600 font-mono font-semibold">Live Applied to 9:16 Feed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Contrast */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-800 font-semibold flex items-center gap-1">
                <Contrast className="w-3.5 h-3.5 text-amber-500" />
                Contrast
              </span>
              <span className="font-mono text-slate-600 font-bold">{colorGrade.contrast.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.7}
              max={1.7}
              step={0.02}
              value={colorGrade.contrast}
              onChange={(e) => onChangeColorGrade({ ...colorGrade, contrast: Number(e.target.value) })}
              className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Saturation */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-800 font-semibold flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-cyan-600" />
                Saturation (Vibrance)
              </span>
              <span className="font-mono text-slate-600 font-bold">{colorGrade.saturate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.0}
              max={2.2}
              step={0.05}
              value={colorGrade.saturate}
              onChange={(e) => onChangeColorGrade({ ...colorGrade, saturate: Number(e.target.value) })}
              className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Brightness */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-800 font-semibold flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                Exposure / Brightness
              </span>
              <span className="font-mono text-slate-600 font-bold">{colorGrade.brightness.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.7}
              max={1.4}
              step={0.02}
              value={colorGrade.brightness}
              onChange={(e) => onChangeColorGrade({ ...colorGrade, brightness: Number(e.target.value) })}
              className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Warmth */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-800 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                Warmth / Sepia
              </span>
              <span className="font-mono text-slate-600 font-bold">{(colorGrade.sepia * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.8}
              step={0.02}
              value={colorGrade.sepia}
              onChange={(e) => onChangeColorGrade({ ...colorGrade, sepia: Number(e.target.value) })}
              className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
