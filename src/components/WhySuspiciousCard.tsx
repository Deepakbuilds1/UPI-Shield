import React from 'react';

interface WhySuspiciousCardProps {
  reasons: string[];
}

export const WhySuspiciousCard: React.FC<WhySuspiciousCardProps> = ({ reasons }) => {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-[#0B1F33]">
          Why this message is risky
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Contextual analysis of coercive techniques and deception patterns
        </p>
      </div>

      <div className="space-y-3">
        {reasons.map((reason, index) => {
          // If reason has a colon or title pattern, split it for cleaner display
          const parts = reason.split(':');
          const hasTitle = parts.length > 1;
          const title = hasTitle ? parts[0].trim() : null;
          const body = hasTitle ? parts.slice(1).join(':').trim() : reason;

          return (
            <div
              key={index}
              className="p-4 rounded-lg bg-[#F8FAFC] border border-slate-200 flex items-start space-x-3.5"
            >
              <span className="text-xs font-mono font-bold text-slate-400 shrink-0 mt-0.5">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="space-y-1">
                {title && (
                  <span className="text-sm font-semibold text-[#0B1F33] block">
                    {title}
                  </span>
                )}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
