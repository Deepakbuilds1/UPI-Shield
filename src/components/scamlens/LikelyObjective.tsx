import React from 'react';
import { Target, HelpCircle } from 'lucide-react';

interface LikelyObjectiveProps {
  objective: string;
}

export const LikelyObjective: React.FC<LikelyObjectiveProps> = ({ objective }) => {
  if (!objective) return null;

  return (
    <div
      id="likely-objective-card"
      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-slate-700" />
          <h4 className="text-sm font-bold text-[#0B1F33]">
            Likely objective
          </h4>
        </div>
        <span className="text-[11px] text-slate-500 flex items-center space-x-1">
          <HelpCircle className="w-3 h-3 text-slate-400" />
          <span>Contextual assessment</span>
        </span>
      </div>

      <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/70">
        {objective}
      </p>

      <p className="text-[11px] text-slate-500 leading-normal">
        Based on observed manipulation sequences. Fraudulent workflows are designed to channel user compliance toward this target outcome.
      </p>
    </div>
  );
};
