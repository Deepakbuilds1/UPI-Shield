import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

interface RecommendedActionsCardProps {
  recommendations: string[];
}

export const RecommendedActionsCard: React.FC<RecommendedActionsCardProps> = ({
  recommendations,
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 block">
            Guidance Playbook
          </span>
          <h3 className="text-base font-bold text-[#0B1F33]">
            Recommended Protective Actions
          </h3>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          Action Checklist
        </span>
      </div>

      <div className="space-y-2">
        {recommendations.map((action, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 rounded-lg bg-[#F8FAFC] border border-slate-200"
          >
            <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {action}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
