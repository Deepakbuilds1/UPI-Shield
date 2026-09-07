import React from 'react';
import { AlertCircle, Gauge } from 'lucide-react';

interface ManipulationScoreProps {
  score: number; // 0 - 100
  paymentRiskScore?: number;
}

export const ManipulationScore: React.FC<ManipulationScoreProps> = ({
  score,
  paymentRiskScore,
}) => {
  const getSeverity = (val: number) => {
    if (val >= 85) return { label: 'CRITICAL MANIPULATION', color: 'text-[#B91C1C]', bg: 'bg-[#FEF2F2]', border: 'border-[#FCA5A5]' };
    if (val >= 70) return { label: 'HIGH MANIPULATION', color: 'text-[#B91C1C]', bg: 'bg-[#FEF2F2]', border: 'border-[#FCA5A5]' };
    if (val >= 45) return { label: 'MEDIUM MANIPULATION', color: 'text-[#B45309]', bg: 'bg-[#FFFBEB]', border: 'border-[#FCD34D]' };
    if (val >= 20) return { label: 'LOW MANIPULATION', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' };
    return { label: 'MINIMAL / SAFE', color: 'text-[#15803D]', bg: 'bg-[#F0FDF4]', border: 'border-[#BBF7D0]' };
  };

  const severity = getSeverity(score);

  return (
    <div
      id="manipulation-score-card"
      className={`rounded-xl border ${severity.border} ${severity.bg} p-4 sm:p-5 transition-colors`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-slate-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Psychological Pressure Metric
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200/80 text-slate-700">
              Contextual assessment
            </span>
          </div>
          <div className="mt-1 flex items-baseline space-x-3">
            <h4 className="text-base sm:text-lg font-bold text-[#0B1F33]">
              Manipulation Risk
            </h4>
            <span className={`text-xs font-bold uppercase tracking-wide ${severity.color}`}>
              {severity.label}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {paymentRiskScore !== undefined && (
            <div className="text-right">
              <span className="text-[10px] font-medium uppercase text-slate-500 block">
                Payment Risk
              </span>
              <span className="text-xl font-bold font-mono text-slate-800">
                {paymentRiskScore}
                <span className="text-xs font-normal text-slate-400">/100</span>
              </span>
            </div>
          )}

          <div className="h-8 w-px bg-slate-200" />

          <div className="text-right">
            <span className="text-[10px] font-medium uppercase text-slate-500 block">
              Manipulation Risk
            </span>
            <span className={`text-2xl font-bold font-mono ${severity.color}`}>
              {score}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-start space-x-2 text-xs text-slate-600 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          Measures how strongly the message attempts to pressure, deceive, isolate, or emotionally influence the recipient into taking a payment-related action.
          <span className="text-slate-400 block sm:inline sm:ml-1">
            (Contextual manipulation assessment based on NLP linguistic heuristics; not clinical or psychological measurement.)
          </span>
        </p>
      </div>
    </div>
  );
};
