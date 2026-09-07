import React from 'react';
import { ScamCategory, RiskLevel } from '../types';
import { ShieldAlert, Tag, CheckCircle2 } from 'lucide-react';

interface ScamCategoryCardProps {
  categories: ScamCategory[];
  riskLevel?: RiskLevel;
}

export const ScamCategoryCard: React.FC<ScamCategoryCardProps> = ({
  categories,
  riskLevel = 'HIGH',
}) => {
  if (!categories || categories.length === 0) return null;

  const primary = categories[0];
  const secondary = categories.slice(1);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 block">
            Category Assessment
          </span>
          <h3 className="text-base font-bold text-[#0B1F33]">
            {primary.name}
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">
            Match Confidence:
          </span>
          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
            {Math.round(primary.confidence * 100)}%
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed">
        {primary.description ||
          'This message contains multiple signals commonly associated with social-engineering payment scams.'}
      </p>

      {/* Secondary Categories if present */}
      {secondary.length > 0 && (
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="text-xs font-medium text-slate-500 block">
            Related risk patterns:
          </span>
          <div className="flex flex-wrap gap-2">
            {secondary.map((cat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700"
              >
                <span>{cat.name}</span>
                <span className="text-xs font-mono text-slate-500">
                  ({Math.round(cat.confidence * 100)}%)
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
