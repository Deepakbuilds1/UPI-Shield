import React, { useState } from 'react';
import { ShieldAlert, Check, AlertOctagon, HelpCircle, X, ExternalLink } from 'lucide-react';
import { RiskLevel } from '../types';

interface SafetyCardProps {
  riskLevel: RiskLevel;
}

export const SafetyCard: React.FC<SafetyCardProps> = ({ riskLevel }) => {
  const [showVerifyGuide, setShowVerifyGuide] = useState(false);

  if (riskLevel !== 'HIGH' && riskLevel !== 'CRITICAL') {
    return null;
  }

  const isCritical = riskLevel === 'CRITICAL';

  return (
    <>
      <div className="rounded-xl border border-[#B91C1C] bg-[#FEF2F2] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200 pb-3">
          <div>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#B91C1C] block">
              Security Recommendation
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#B91C1C] tracking-tight mt-0.5">
              DO NOT PAY YET
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowVerifyGuide(true)}
            className="self-start sm:self-auto h-9 px-3.5 rounded-lg text-xs font-semibold text-[#0B1F33] bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs inline-flex items-center space-x-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#0F766E]" />
            <span>How to Verify Safely</span>
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-800">
            Before making any payment:
          </p>

          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start space-x-2.5">
              <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
              <span><strong>Verify the sender independently</strong> via official published customer care numbers.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
              <span><strong>Use the organization's official website</strong> or verified mobile application.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
              <span><strong>Never share your UPI PIN or OTP</strong> under any circumstance.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
              <span><strong>Do not approve unexpected payment requests</strong> or collect notifications on UPI apps.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <Check className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
              <span><strong>Do not scan unknown QR codes</strong> to receive money, refunds, or cashback.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Clean Verification Guide Dialog */}
      {showVerifyGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-lg text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-[#0B1F33]">
                How to Independently Verify Payment Requests
              </h4>
              <button
                type="button"
                onClick={() => setShowVerifyGuide(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-900 block">1. Electricity / Utility Bills</span>
                <p>Do NOT call the mobile number sent in the SMS. Open your state electricity board's official consumer app or check your paper bill for the official helpline.</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-900 block">2. Bank & KYC Warnings</span>
                <p>Visit your local branch or call the toll-free customer support number printed on the back of your debit card. Banks never mandate ₹1 fee transfers for KYC renewals.</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-900 block">3. Courier & Delivery Issues</span>
                <p>Check the tracking status on the courier's official website. Never install remote assistance APKs or AnyDesk to resolve parcel deliveries.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowVerifyGuide(false)}
                className="h-9 px-4 rounded-lg text-xs font-semibold text-white bg-[#0B1F33] hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
