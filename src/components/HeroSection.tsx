import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, Lock, Activity, Eye } from 'lucide-react';

interface HeroSectionProps {
  onAnalyzeClick: () => void;
  onTryDemoClick: () => void;
  onTryScamLensClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAnalyzeClick,
  onTryDemoClick,
  onTryScamLensClick,
}) => {
  return (
    <section className="border-b border-slate-200 bg-white py-10 sm:py-14">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Product Narrative */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-500 block">
                  UPI-Shield • Digital Payment Safety
                </span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  <Eye className="w-3 h-3 text-teal-600" />
                  <span>Includes ScamLens</span>
                </span>
              </div>
              <h1 className="text-[32px] sm:text-[38px] leading-[1.2] font-bold text-[#0B1F33] tracking-tight">
                Think Before You Pay.
              </h1>
            </div>

            <p className="text-[15px] sm:text-[16px] leading-relaxed text-slate-600 max-w-xl">
              Analyze suspicious payment messages for urgency, impersonation, coercion, and
              social-engineering attack chains before you authorize a transaction.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onAnalyzeClick}
                aria-label="Analyze a message"
                className="ui-button ui-button-primary h-11 px-5 text-sm font-semibold inline-flex items-center space-x-2 cursor-pointer shadow-2xs"
              >
                <span>Analyze a Message</span>
                <ArrowDown className="w-4 h-4 text-emerald-100" />
              </button>

              {onTryScamLensClick && (
                <button
                  type="button"
                  onClick={onTryScamLensClick}
                  className="ui-button h-11 px-4 text-sm font-semibold text-[#0F766E] bg-teal-50 hover:bg-teal-100 border border-teal-300 transition-colors shadow-2xs inline-flex items-center space-x-1.5 cursor-pointer"
                  title="Load the 5-step electricity disconnection scam attack chain demo"
                >
                  <Eye className="w-4 h-4 text-teal-700" />
                  <span>Try ScamLens</span>
                </button>
              )}

              <button
                type="button"
                onClick={onTryDemoClick}
                className="ui-button ui-button-secondary h-11 px-4 text-sm font-semibold text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
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
                  <span className="text-xs font-semibold text-slate-700">
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

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
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
