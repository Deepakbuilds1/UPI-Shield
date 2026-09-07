import React from 'react';
import { X, Play, FileText } from 'lucide-react';
import { TEST_CASES } from '../data/demoMessages';
import { DemoTestCase, RiskLevel } from '../types';

interface TestCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTestCase: (testCase: DemoTestCase) => void;
}

export const TestCasesModal: React.FC<TestCasesModalProps> = ({
  isOpen,
  onClose,
  onSelectTestCase,
}) => {
  if (!isOpen) return null;

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-[#B91C1C] bg-[#FEF2F2] border-[#FCA5A5]';
      case 'HIGH':
        return 'text-[#B91C1C] bg-[#FEF2F2] border-[#FCA5A5]';
      case 'MEDIUM':
        return 'text-[#B45309] bg-[#FFFBEB] border-[#FCD34D]';
      case 'LOW':
        return 'text-slate-700 bg-slate-100 border-slate-200';
      case 'SAFE':
      default:
        return 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-xl p-6 space-y-4 max-h-[90vh] flex flex-col text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#0B1F33]">
              10 Benchmark Test Cases
            </h3>
            <p className="text-xs text-slate-500">
              Evaluate detection performance against common Indian payment scam vectors
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
          {TEST_CASES.map((tc) => (
            <div
              key={tc.id}
              className="p-3 rounded-lg border border-slate-200 bg-[#F8FAFC] hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="text-xs font-bold text-[#0B1F33]">
                    {tc.title}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {tc.tag}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getRiskBadge(
                      tc.expectedRisk
                    )}`}
                  >
                    Expected: {tc.expectedRisk}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-1 font-mono">
                  "{tc.text}"
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectTestCase(tc);
                  onClose();
                }}
                className="h-8 px-3 rounded-lg text-xs font-semibold text-white bg-[#0B1F33] hover:bg-slate-800 transition-colors flex items-center space-x-1 shrink-0 cursor-pointer"
              >
                <span>Load Sample</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Covers electricity, KYC, lottery, parcel, remote-access, and safe bank alerts</span>
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
