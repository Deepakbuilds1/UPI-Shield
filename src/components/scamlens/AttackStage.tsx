import React from 'react';
import { AttackStage as AttackStageType } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  Gift,
  PhoneOff,
  EyeOff,
  CreditCard,
  Key,
  HeartHandshake,
  Zap,
  MonitorSmartphone,
  ChevronRight,
} from 'lucide-react';

interface AttackStageProps {
  stage: AttackStageType;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  isLast?: boolean;
}

export const getStageMeta = (stageName: string) => {
  const norm = stageName.toUpperCase().replace(/\s+/g, '_');
  switch (norm) {
    case 'AUTHORITY':
      return {
        title: 'Authority Impersonation',
        short: 'Authority',
        icon: ShieldAlert,
        color: 'text-indigo-700',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        activeRing: 'ring-2 ring-indigo-600',
      };
    case 'FEAR':
      return {
        title: 'Fear & Intimidation',
        short: 'Fear',
        icon: AlertTriangle,
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        activeRing: 'ring-2 ring-amber-600',
      };
    case 'URGENCY':
      return {
        title: 'Artificial Urgency',
        short: 'Urgency',
        icon: Clock,
        color: 'text-rose-700',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        activeRing: 'ring-2 ring-rose-600',
      };
    case 'REWARD':
      return {
        title: 'Financial Bait / Reward',
        short: 'Reward Bait',
        icon: Gift,
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        activeRing: 'ring-2 ring-emerald-600',
      };
    case 'ISOLATION':
      return {
        title: 'Victim Isolation',
        short: 'Isolation',
        icon: PhoneOff,
        color: 'text-purple-700',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        activeRing: 'ring-2 ring-purple-600',
      };
    case 'DECEPTION':
      return {
        title: 'Deception & Pretext',
        short: 'Deception',
        icon: EyeOff,
        color: 'text-slate-700',
        bg: 'bg-slate-100',
        border: 'border-slate-300',
        activeRing: 'ring-2 ring-slate-600',
      };
    case 'PAYMENT_PRESSURE':
    case 'PAYMENT':
      return {
        title: 'Payment Pressure',
        short: 'Payment Pretext',
        icon: CreditCard,
        color: 'text-[#B91C1C]',
        bg: 'bg-red-50',
        border: 'border-red-200',
        activeRing: 'ring-2 ring-[#B91C1C]',
      };
    case 'CREDENTIAL_PRESSURE':
      return {
        title: 'Credential Pressure',
        short: 'Credential Theft',
        icon: Key,
        color: 'text-red-800',
        bg: 'bg-red-100',
        border: 'border-red-300',
        activeRing: 'ring-2 ring-red-700',
      };
    case 'TRUST_BUILDING':
      return {
        title: 'Trust Building',
        short: 'Trust Building',
        icon: HeartHandshake,
        color: 'text-teal-700',
        bg: 'bg-teal-50',
        border: 'border-teal-200',
        activeRing: 'ring-2 ring-teal-600',
      };
    case 'CONSEQUENCE_THREAT':
      return {
        title: 'Consequence Threat',
        short: 'Threat Escalation',
        icon: Zap,
        color: 'text-orange-700',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        activeRing: 'ring-2 ring-orange-600',
      };
    case 'REMOTE_ACCESS_REQUEST':
    case 'REMOTE_ACCESS':
      return {
        title: 'Remote Access Request',
        short: 'Remote Access',
        icon: MonitorSmartphone,
        color: 'text-purple-800',
        bg: 'bg-purple-100',
        border: 'border-purple-300',
        activeRing: 'ring-2 ring-purple-700',
      };
    default:
      return {
        title: stageName,
        short: stageName,
        icon: ShieldAlert,
        color: 'text-slate-700',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        activeRing: 'ring-2 ring-slate-600',
      };
  }
};

export const AttackStage: React.FC<AttackStageProps> = ({
  stage,
  index,
  isSelected,
  onSelect,
}) => {
  const meta = getStageMeta(stage.stage);
  const Icon = meta.icon;

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <button
      id={`attack-stage-btn-${index}`}
      onClick={onSelect}
      type="button"
      className={`relative text-left group w-full sm:w-auto min-w-[140px] flex-1 rounded-xl p-3.5 border transition-all duration-200 cursor-pointer ${
        isSelected
          ? `${meta.bg} ${meta.border} ${meta.activeRing} shadow-sm`
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
      }`}
      aria-label={`Stage ${index + 1}: ${meta.title}. Click to view details.`}
      aria-pressed={isSelected}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center space-x-1.5">
          <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center font-mono shrink-0">
            {index + 1}
          </span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(
              stage.severity
            )}`}
          >
            {stage.severity}
          </span>
        </div>

        <div className={`p-1 rounded-md ${meta.bg} ${meta.color}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="space-y-0.5">
        <span className="block text-xs font-bold text-[#0B1F33] tracking-tight truncate">
          {meta.short}
        </span>
        <p className="text-xs text-slate-500 line-clamp-1 italic font-mono">
          &ldquo;{stage.evidence || stage.explanation}&rdquo;
        </p>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-slate-700">
        <span className="font-medium">Inspect stage</span>
        <ChevronRight
          className={`w-3.5 h-3.5 transition-transform ${
            isSelected ? 'text-[#0B1F33] translate-x-0.5' : 'text-slate-400'
          }`}
        />
      </div>
    </button>
  );
};
