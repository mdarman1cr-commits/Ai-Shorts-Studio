import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, Film, Type, Palette, CheckCircle2, Flame } from 'lucide-react';

interface AnalysisProgressModalProps {
  isOpen: boolean;
  videoTitle: string;
}

export const AnalysisProgressModal: React.FC<AnalysisProgressModalProps> = ({ isOpen, videoTitle }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Ingesting Video Stream & Audio', desc: 'Sampling frames and transcribing speech...', icon: Film },
    { title: 'Gemini Deep AI Viral Analysis', desc: 'Detecting high-retention hooks and emotional climax...', icon: Brain },
    { title: 'Smart Subtitle & Word Timestamps', desc: 'Syncing Karaoke animations and keyword highlights...', icon: Type },
    { title: 'Cinematic Color Grading Synthesis', desc: 'Calculating LUT warmth, contrast, and film curve...', icon: Palette },
    { title: 'Assembling 9:16 Shorts Package', desc: 'Formatting viral descriptions, hashtags, and framing...', icon: Flame },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isOpen, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Animated glowing icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 blur-xl opacity-40 animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-red-600 shadow-xs">
            <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black text-slate-900">AI Deep Video Analysis</h3>
          <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-mono">
            {videoTitle || 'Processing YouTube video...'}
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5 text-left">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            const StepIcon = step.icon;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 p-2.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-red-500 bg-red-50/70 ring-1 ring-red-500/20'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : 'border-slate-200/60 opacity-40 bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : isCurrent
                      ? 'bg-red-100 text-red-600 animate-pulse'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isCurrent ? 'text-slate-900' : isDone ? 'text-slate-800' : 'text-slate-500'}`}>
                      {step.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] text-red-600 font-mono animate-pulse font-bold">
                        In Progress...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-400 font-medium">
          Extracting optimal 9:16 timestamps and generating animated subtitles...
        </div>
      </div>
    </div>
  );
};
