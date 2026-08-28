import React from 'react';
import { Layout, Crop, Smartphone, SplitSquareVertical, Layers } from 'lucide-react';
import { LayoutMode } from '../../types';

interface FramingStudioProps {
  layoutMode: LayoutMode;
  onChangeLayoutMode: (mode: LayoutMode) => void;
}

export const FramingStudio: React.FC<FramingStudioProps> = ({
  layoutMode,
  onChangeLayoutMode,
}) => {
  const layouts: { id: LayoutMode; label: string; desc: string; icon: React.FC<any> }[] = [
    {
      id: 'center_crop',
      label: 'Smart 9:16 Center Crop',
      desc: 'Auto-zooms and centers primary speaker for immersive full-screen vertical viewing.',
      icon: Crop,
    },
    {
      id: 'split_screen',
      label: 'Dual Split Screen (Podcast)',
      desc: 'Top and bottom split frame ideal for interview dialogues, reaction clips, and podcasts.',
      icon: SplitSquareVertical,
    },
    {
      id: 'blur_padding',
      label: 'Blurred Letterbox Glow',
      desc: 'Keeps full 16:9 widescreen intact while generating dynamic glowing blurred video margins.',
      icon: Layers,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">9:16 Vertical Framing & Layout</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {layouts.map((item) => {
          const isSelected = layoutMode === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeLayoutMode(item.id)}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/30 shadow-xs'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">{item.label}</div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
