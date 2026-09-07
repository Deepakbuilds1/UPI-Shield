import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

interface ThreatMeterProps {
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  confidence: number;
}

export const ThreatMeter: React.FC<ThreatMeterProps> = ({
  score,
  riskLevel,
  confidence,
}) => {
  const getLevelConfig = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          label: 'CRITICAL RISK',
          colorClass: 'text-[#B91C1C]',
          bgLight: 'bg-[#FEF2F2]',
          borderClass: 'border-[#FCA5A5]',
          badgeClass: 'bg-[#B91C1C] text-white',
          icon: <AlertOctagon className="w-5 h-5 text-[#B91C1C]" />,
          summary: 'High-confidence indicators of malicious coercion or financial trap detected.',
        };
      case 'HIGH':
        return {
          label: 'HIGH RISK',
          colorClass: 'text-[#B91C1C]',
          bgLight: 'bg-[#FEF2F2]',
          borderClass: 'border-[#FCA5A5]',
          badgeClass: 'bg-[#B91C1C] text-white',
          icon: <AlertTriangle className="w-5 h-5 text-[#B91C1C]" />,
          summary: 'Multiple social-engineering and unauthorized payment pressure signals detected.',
        };
      case 'MEDIUM':
        return {
          label: 'MEDIUM RISK',
          colorClass: 'text-[#B45309]',
          bgLight: 'bg-[#FFFBEB]',
          borderClass: 'border-[#FCD34D]',
          badgeClass: 'bg-[#B45309] text-white',
          icon: <ShieldAlert className="w-5 h-5 text-[#B45309]" />,
          summary: 'Unverified urgency or suspicious transaction parameters identified.',
        };
      case 'LOW':
        return {
          label: 'LOW RISK',
          colorClass: 'text-slate-700',
          bgLight: 'bg-[#F8FAFC]',
          borderClass: 'border-slate-200',
          badgeClass: 'bg-slate-700 text-white',
          icon: <Info className="w-5 h-5 text-slate-600" />,
          summary: 'Payment request detected without overt coercion or artificial urgency signals.',
        };
      case 'SAFE':
      default:
        return {
          label: 'SAFE',
          colorClass: 'text-[#15803D]',
          bgLight: 'bg-[#F0FDF4]',
          borderClass: 'border-[#BBF7D0]',
          badgeClass: 'bg-[#15803D] text-white',
          icon: <ShieldCheck className="w-5 h-5 text-[#15803D]" />,
          summary: 'Message context matches legitimate transactional or notification patterns.',
        };
    }
  };

  const config = getLevelConfig(riskLevel);

  // Position for horizontal indicator clamped between 4% and 96%
  const pinLeft = Math.min(Math.max(score, 4), 96);

  return (
    <div className={`rounded-xl border ${config.borderClass} ${config.bgLight} p-5 sm:p-6 transition-colors`}>
      <div className="space-y-4">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3">
          <div>
            <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 block">
              Security Assessment
            </span>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-xl font-bold text-[#0B1F33]">
                Risk Level:
              </span>
              <span className={`text-xl font-bold ${config.colorClass}`}>
                {config.label}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-xs font-medium text-slate-500 block">
                Risk Score
              </span>
              <span className="text-2xl font-bold font-mono text-[#0B1F33]">
                {score}
                <span className="text-sm font-normal text-slate-400"> / 100</span>
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-right">
              <span className="text-xs font-medium text-slate-500 block">
                Confidence
              </span>
              <span className="text-sm font-semibold font-mono text-slate-700">
                {Math.round(confidence * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Clean Horizontal Risk Indicator (Replacing circular speedometer) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-0.5">
            <span className={score < 25 ? 'text-[#15803D] font-bold' : ''}>Low</span>
            <span className={score >= 25 && score < 50 ? 'text-slate-700 font-bold' : ''}>Medium</span>
            <span className={score >= 50 && score < 75 ? 'text-[#B45309] font-bold' : ''}>High</span>
            <span className={score >= 75 ? 'text-[#B91C1C] font-bold' : ''}>Critical</span>
          </div>

          {/* Horizontal Track with subtle zone colors */}
          <div className="relative h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
            <div className="w-1/4 h-full bg-[#15803D]/30 border-r border-white/60" />
            <div className="w-1/4 h-full bg-slate-300 border-r border-white/60" />
            <div className="w-1/4 h-full bg-[#B45309]/30 border-r border-white/60" />
            <div className="w-1/4 h-full bg-[#B91C1C]/30" />
          </div>

          {/* Pin Marker */}
          <div className="relative h-6 w-full">
            <div
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
              style={{ left: `${pinLeft}%` }}
            >
              <div className="w-3 h-3 rounded-full bg-[#0B1F33] border-2 border-white shadow-xs" />
              <span className="text-xs font-bold font-mono text-slate-800 mt-0.5">
                {score}
              </span>
            </div>
          </div>
        </div>

        {/* Short Executive Summary */}
        <div className="pt-2 flex items-start space-x-2 text-xs text-slate-600">
          <div className="shrink-0 mt-0.5">{config.icon}</div>
          <p className="leading-relaxed">
            {config.summary}
          </p>
        </div>
      </div>
    </div>
  );
};
