import React from 'react';
import { ArrowDown, XCircle, CheckCircle, Sparkles } from 'lucide-react';

export const ScamLensComparison: React.FC = () => {
  return (
    <div
      id="scamlens-comparison-card"
      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-teal-700" />
          <h4 className="text-sm font-bold text-[#0B1F33]">
            The ScamLens Difference
          </h4>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Cognitive defense overview
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch text-xs">
        {/* Without ScamLens */}
        <div className="rounded-lg border border-red-200 bg-red-50/40 p-3.5 flex flex-col justify-between space-y-2.5 h-full">
          <div className="flex items-center space-x-1.5 text-red-800 font-bold text-xs">
            <XCircle className="w-4 h-4 text-red-600" />
            <span>Without ScamLens</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs flex-1 flex flex-col justify-between">
            <div className="bg-white p-2.5 rounded border border-red-200 text-slate-800 min-h-12 flex items-center">
              &ldquo;Pay now because your electricity will be disconnected.&rdquo;
            </div>

            <div className="flex justify-center text-red-400 py-0.5">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            <div className="bg-white p-2.5 rounded border border-red-200 text-red-900 font-sans font-medium min-h-10 flex items-center">
              Victim only sees urgency & panic.
            </div>

            <div className="flex justify-center text-red-400 py-0.5">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            <div className="bg-red-100 p-2.5 rounded border border-red-300 text-red-950 font-sans font-bold min-h-12 flex items-center">
              Victim may act emotionally and authorize payment.
            </div>
          </div>
        </div>

        {/* With ScamLens */}
        <div className="rounded-lg border border-teal-200 bg-teal-50/40 p-3.5 flex flex-col justify-between space-y-2.5 h-full">
          <div className="flex items-center space-x-1.5 text-teal-800 font-bold text-xs">
            <CheckCircle className="w-4 h-4 text-teal-600" />
            <span>With ScamLens</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs flex-1 flex flex-col justify-between">
            <div className="bg-white p-2.5 rounded border border-teal-200 text-slate-800 font-sans font-semibold min-h-12 flex items-center">
              Authority → Fear → Urgency → Isolation → Payment
            </div>

            <div className="flex justify-center text-teal-500 py-0.5">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            <div className="bg-white p-2.5 rounded border border-teal-200 text-teal-900 font-sans font-medium min-h-10 flex items-center">
              Victim recognizes the 5-step manipulation chain.
            </div>

            <div className="flex justify-center text-teal-500 py-0.5">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            <div className="bg-teal-100 p-2.5 rounded border border-teal-300 text-teal-950 font-sans font-bold min-h-12 flex items-center">
              Victim pauses at safest point and verifies with official provider.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
