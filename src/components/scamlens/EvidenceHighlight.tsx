import React from 'react';
import { SemanticHighlight } from '../../types';
import { Quote, Search } from 'lucide-react';

interface EvidenceHighlightProps {
  originalText: string;
  highlights?: SemanticHighlight[];
}

export const EvidenceHighlight: React.FC<EvidenceHighlightProps> = ({
  originalText,
  highlights = [],
}) => {
  if (!originalText) return null;

  const getBadgeStyle = (stage: string) => {
    const s = stage.toUpperCase();
    if (s.includes('FEAR') || s.includes('CONSEQUENCE')) {
      return { bg: 'bg-amber-100 text-amber-900 border-amber-300', tag: 'bg-amber-600 text-white' };
    }
    if (s.includes('URGENCY')) {
      return { bg: 'bg-rose-100 text-rose-900 border-rose-300', tag: 'bg-rose-600 text-white' };
    }
    if (s.includes('ISOLATION')) {
      return { bg: 'bg-purple-100 text-purple-900 border-purple-300', tag: 'bg-purple-600 text-white' };
    }
    if (s.includes('PAYMENT')) {
      return { bg: 'bg-red-100 text-red-900 border-red-300', tag: 'bg-red-600 text-white' };
    }
    if (s.includes('AUTHORITY')) {
      return { bg: 'bg-indigo-100 text-indigo-900 border-indigo-300', tag: 'bg-indigo-600 text-white' };
    }
    if (s.includes('REMOTE')) {
      return { bg: 'bg-purple-100 text-purple-900 border-purple-300', tag: 'bg-purple-700 text-white' };
    }
    if (s.includes('CREDENTIAL')) {
      return { bg: 'bg-red-100 text-red-900 border-red-300', tag: 'bg-red-700 text-white' };
    }
    return { bg: 'bg-slate-100 text-slate-900 border-slate-300', tag: 'bg-slate-700 text-white' };
  };

  return (
    <div id="evidence-highlight-card" className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center space-x-2">
          <Quote className="w-4 h-4 text-teal-700" />
          <h4 className="text-sm font-bold text-[#0B1F33]">
            What the sender is doing
          </h4>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Contextual semantic message analysis
        </span>
      </div>

      {/* Message Box with Highlights */}
      <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-3.5 sm:p-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
        {originalText}
      </div>

      {/* Semantic Marker Cards extracted directly from message */}
      {highlights && highlights.length > 0 ? (
        <div className="space-y-2 pt-1">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Extracted Manipulation Tactics in Text</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {highlights.map((h, i) => {
              const style = getBadgeStyle(h.stage);
              return (
                <div
                  key={`highlight-${i}`}
                  className={`rounded-lg border p-2.5 flex items-start justify-between gap-2 ${style.bg}`}
                >
                  <div className="space-y-0.5">
                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${style.tag}`}>
                      {h.label}
                    </span>
                    <p className="text-xs font-mono font-medium text-slate-900">
                      &ldquo;{h.text}&rdquo;
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-500 italic">
          No acute emotional triggers or coercive phrases were isolated in this text.
        </div>
      )}
    </div>
  );
};
