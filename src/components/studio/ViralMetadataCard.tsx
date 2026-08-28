import React, { useState } from 'react';
import { Youtube, Copy, Check, Hash, Sparkles, Flame, Share2, Tag } from 'lucide-react';
import { ShortClip } from '../../types';

interface ViralMetadataCardProps {
  shortClip: ShortClip;
}

export const ViralMetadataCard: React.FC<ViralMetadataCardProps> = ({ shortClip }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fullPackage = `${shortClip.title}

${shortClip.viralDescription}

${shortClip.hashtags.join(' ')}`;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-600" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900">Viral Shorts SEO & Metadata</h3>
        </div>
        <button
          type="button"
          onClick={() => handleCopy(fullPackage, 'all')}
          className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
        >
          {copiedField === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedField === 'all' ? 'Copied Full Kit!' : 'Copy All'}</span>
        </button>
      </div>

      <div className="space-y-3.5">
        {/* Title */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-bold text-slate-700">Click-Optimized Title</span>
            <button
              onClick={() => handleCopy(shortClip.title, 'title')}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              {copiedField === 'title' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedField === 'title' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900 font-mono">{shortClip.title}</p>
        </div>

        {/* Description */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-bold text-slate-700">Algorithm Retention Description</span>
            <button
              onClick={() => handleCopy(shortClip.viralDescription, 'desc')}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              {copiedField === 'desc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedField === 'desc' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{shortClip.viralDescription}</p>
        </div>

        {/* Hashtags */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Hash className="w-3 h-3 text-amber-500" />
              High-Ranking Hashtags
            </span>
            <button
              onClick={() => handleCopy(shortClip.hashtags.join(' '), 'tags')}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              {copiedField === 'tags' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedField === 'tags' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {shortClip.hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-mono font-bold text-amber-700 shadow-2xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
