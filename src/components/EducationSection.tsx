import React from 'react';
import { Lock, ShieldCheck, Check, AlertTriangle } from 'lucide-react';

export const EducationSection: React.FC = () => {
  return (
    <section id="education-section" className="py-14 border-t border-slate-200 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl text-left space-y-2">
          <span className="text-[13px] font-semibold uppercase tracking-wider text-slate-500 block">
            How It Works
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0B1F33] tracking-tight">
            The Pre-Authorization Security Gap in Digital Payments
          </h2>
          <p className="text-[15px] text-slate-600 leading-relaxed">
            In modern digital payment fraud, attackers rarely breach encryption or compromise banking servers. Instead, they exploit cognitive pressure to convince authorized users to authorize fraudulent transactions.
          </p>
        </div>

        {/* 2-Column Paradigm Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Technical Authentication */}
          <div className="rounded-xl border border-slate-200 p-6 bg-[#F8FAFC] space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#0B1F33]">
                  Authentication & Identity (MPIN / OTP)
                </h3>
                <span className="text-xs text-slate-500">Traditional Banking Security Layer</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700">
              <span className="font-semibold text-slate-900 block mb-1">Security Question:</span>
              <span className="italic text-slate-600">"Is this the legitimate device and credential holder?"</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-bold">•</span>
                <span>Validates credential possession, but cannot assess whether the user is under coercion or false pretenses.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-bold">•</span>
                <span>Fails when the authorized user willingly enters their MPIN due to fear of utility disconnection or legal threats.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-bold">•</span>
                <span>Operates after the psychological trap has already succeeded.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Contextual Defense */}
          <div className="rounded-xl border border-[#0F766E]/40 p-6 bg-white space-y-4 shadow-2xs">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-[#0F766E] flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#0B1F33]">
                  UPI-Shield Contextual Defense
                </h3>
                <span className="text-xs text-[#0F766E] font-medium">Pre-Authorization Safety Layer</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs text-slate-700">
              <span className="font-semibold text-[#0B1F33] block mb-1">Security Question:</span>
              <span className="italic text-slate-700">"Does this payment request make logical and contextual sense?"</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                <span>Extracts artificial countdowns, simulated disconnection notices, and impersonated customer care claims.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                <span>Identifies ₹1 or ₹2 nominal verification transfers used to establish fraudulent autopay mandates.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                <span>Issues immediate plain-language advisories in English and Hindi before payment is confirmed.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Safety Guide Section */}
        <div id="safety-guide-section" className="rounded-xl border border-slate-200 p-6 bg-[#0B1F33] text-white space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 block font-medium">
                Safety Guide
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Core Rules for Secure Digital Payments
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2.5 py-1 rounded">
              NPCI & RBI Best Practices
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700 space-y-1.5">
              <span className="text-xs font-semibold text-emerald-400 block">
                01. PIN Only Sends Money
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your UPI PIN is required <strong>only</strong> to transfer funds out. You never need to enter your PIN to receive funds, refunds, or cashback.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700 space-y-1.5">
              <span className="text-xs font-semibold text-emerald-400 block">
                02. QR Codes Only Debit
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Scanning a QR code debits funds from your account. Legitimate merchants and organizations never send QR codes to credit your account.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700 space-y-1.5">
              <span className="text-xs font-semibold text-emerald-400 block">
                03. Reject Remote Screen Sharing
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Never install remote-access software (AnyDesk, TeamViewer, QuickSupport) on instruction from unverified callers claiming to be bank or utility staff.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700 space-y-1.5">
              <span className="text-xs font-semibold text-emerald-400 block">
                04. Verify via Official Helplines
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Utilities and financial institutions do not dispatch urgent termination threats from personal 10-digit mobile numbers or public email domains.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
