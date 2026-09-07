import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, Lock, Activity, Eye } from 'lucide-react';

interface HeroSectionProps {
  onAnalyzeClick: () => void;
  onTryDemoClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAnalyzeClick,
  onTryDemoClick,
}) => {
  return (
    <section className="border-b border-slate-200 bg-white py-10 sm:py-14">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Product Narrative */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="space-y-1">
              <span className="text-[13px] font-semibold tracking-wider uppercase text-slate-500 block">
                UPI-Shield • Digital Payment Safety
              </span>
              <h1 className="text-[32px] sm:text-[38px] leading-[1.2] font-bold text-[#0B1F33] tracking-tight">
                Think Before You Pay.
              </h1>
            </div>

            <p className="text-[15px] sm:text-[16px] leading-relaxed text-slate-600 max-w-xl">
              Analyze suspicious payment messages for urgency, impersonation, coercion and
              social-engineering signals before you authorize a transaction.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onAnalyzeClick}
                className="h-11 px-5 rounded-lg text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#0d655e] active:bg-[#0b544e] transition-colors shadow-2xs inline-flex items-center space-x-2 cursor-pointer"
              >
                <span>Analyze a Message</span>
                <ArrowDown className="w-4 h-4 text-emerald-200" />
              </button>

              <button
                type="button"
                onClick={onTryDemoClick}
                className="h-11 px-5 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
              >
                Try Example
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-medium text-slate-500">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                <span>Pre-authorization cognitive check</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                <span>Zero banking credentials required</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                <span>No personal data stored</span>
              </div>
            </div>
          </div>

          {/* Right Column: Security Status Panel */}
          <div className="lg:col-span-5">
            <div className="bg-[#F8FAFC] rounded-xl border border-slate-200 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]"></span>
                  <span className="text-[13px] font-semibold uppercase tracking-wider text-slate-700">
                    Security Check
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500">System Status</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Message analysis</span>
                    <span className="text-sm font-semibold text-[#0B1F33]">Ready for input</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-[#15803D] border border-emerald-200">
                    Online
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-[#0B1F33] block">
                      Protecting your next payment
                    </span>
                    <span className="text-xs text-slate-500 leading-relaxed block mt-0.5">
                      Evaluates coercive pretexts, fake KYC warnings, and unauthorized debit collect requests.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-[#0B1F33] block">
                      Privacy-by-Design
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Ephemeral message processing. No personal data stored by default.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Aligned with NPCI UPI 2.0 Security Advisory</span>
                <span>v2.4 Production</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
