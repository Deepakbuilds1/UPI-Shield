import React from 'react';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

interface Props {
  onNavigateHome: () => void;
  reason?: string;
}

export const PermissionDeniedState: React.FC<Props> = ({ onNavigateHome, reason }) => {
  return (
    <div className="max-w-[550px] mx-auto px-4 py-16 text-center space-y-5 font-sans">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
        <ShieldX className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
          Access Restricted (403)
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0B1F33]">
          Action or Resource Forbidden
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
          {reason || 'You do not have administrative permission to invoke this internal testing route or debugging hook directly.'}
        </p>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#0B1F33] text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Threat Analyzer</span>
        </button>
      </div>
    </div>
  );
};
