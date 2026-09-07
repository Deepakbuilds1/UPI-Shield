import React from 'react';
import { RiskSignal, SignalSeverity } from '../types';
import {
  Clock,
  AlertTriangle,
  Building,
  CreditCard,
  KeyRound,
  FileCheck2,
  MonitorCheck,
  QrCode,
  Link,
  ShieldAlert,
} from 'lucide-react';

interface DetectedSignalsListProps {
  signals: RiskSignal[];
}

export const DetectedSignalsList: React.FC<DetectedSignalsListProps> = ({ signals }) => {
  if (!signals || signals.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-center text-slate-500 text-sm">
        No active social-engineering signals detected.
      </div>
    );
  }

  const getSeverityBadge = (severity: SignalSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-[#B91C1C] bg-[#FEF2F2] border-[#FCA5A5]';
      case 'HIGH':
        return 'text-[#B91C1C] bg-[#FEF2F2] border-[#FCA5A5]';
      case 'MEDIUM':
        return 'text-[#B45309] bg-[#FFFBEB] border-[#FCD34D]';
      case 'LOW':
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  const getSignalIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('urgency')) return <Clock className="w-4 h-4 text-slate-600" />;
    if (lower.includes('fear') || lower.includes('threat') || lower.includes('intimidation'))
      return <AlertTriangle className="w-4 h-4 text-slate-600" />;
    if (lower.includes('authority') || lower.includes('impersonation'))
      return <Building className="w-4 h-4 text-slate-600" />;
    if (lower.includes('payment') || lower.includes('pressure'))
      return <CreditCard className="w-4 h-4 text-slate-600" />;
    if (lower.includes('credential') || lower.includes('pin') || lower.includes('otp'))
      return <KeyRound className="w-4 h-4 text-slate-600" />;
    if (lower.includes('verification')) return <FileCheck2 className="w-4 h-4 text-slate-600" />;
    if (lower.includes('remote') || lower.includes('screen'))
      return <MonitorCheck className="w-4 h-4 text-slate-600" />;
    if (lower.includes('qr')) return <QrCode className="w-4 h-4 text-slate-600" />;
    if (lower.includes('link') || lower.includes('intent'))
      return <Link className="w-4 h-4 text-slate-600" />;
    return <ShieldAlert className="w-4 h-4 text-slate-600" />;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-[#0B1F33]">
            Detected Risk Signals ({signals.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Key behavioural and contextual flags identified in the message text
          </p>
        </div>
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          Semantic Extraction
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {signals.map((signal, index) => (
          <div
            key={index}
            className="p-3.5 rounded-lg border border-slate-200 bg-[#F8FAFC] flex flex-col justify-between space-y-2"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded bg-white border border-slate-200">
                    {getSignalIcon(signal.name)}
                  </div>
                  <span className="text-sm font-semibold text-[#0B1F33]">
                    {signal.name}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getSeverityBadge(
                    signal.severity
                  )}`}
                >
                  {signal.severity}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {signal.explanation}
              </p>
            </div>

            {signal.evidence && (
              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-baseline space-x-1">
                <span className="font-semibold text-slate-700 shrink-0">Trigger:</span>
                <span className="font-mono text-slate-700 bg-white px-1 py-0.5 rounded border border-slate-200 truncate">
                  "{signal.evidence}"
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
