import React from 'react';
import { ShieldAlert, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

interface PageProps {
  onNavigateHome: () => void;
}

export const AcceptableUsePage: React.FC<PageProps> = ({ onNavigateHome }) => {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 space-y-8 text-left font-sans">
      <button
        type="button"
        onClick={onNavigateHome}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-[#0B1F33] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Threat Analyzer</span>
      </button>

      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
          <ShieldAlert className="w-4 h-4" />
          <span>API & Platform Usage Terms</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight">
          Acceptable Use Policy
        </h1>
        <p className="text-xs text-slate-500">
          Standards governing permitted and prohibited use of the UPI-Shield analysis service
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#0B1F33]">1. Permitted Uses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold text-xs">Individual Verification:</strong>
                <span className="text-slate-600 text-xs">
                  Evaluating unsolicited payment requests or messages received by you, friends, or family.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold text-xs">Security Research & Education:</strong>
                <span className="text-slate-600 text-xs">
                  Reviewing known scam typologies and educating payment consumers on digital safety patterns.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#0B1F33]">2. Prohibited Uses</h2>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg border border-red-200 bg-red-50/40 flex items-start space-x-2.5">
              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold">Phishing Development & Evasion:</strong>
                <span className="text-slate-600 ml-1">
                  Using this scoring system iteratively to engineer scam text specifically designed to evade heuristic or AI detection filters.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-red-200 bg-red-50/40 flex items-start space-x-2.5">
              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold">Automated Abuse & Scraping:</strong>
                <span className="text-slate-600 ml-1">
                  Deploying bots or automated scraping scripts to flood <code>/api/analyze</code> or <code>/api/ocr</code> endpoints without authorization.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-red-200 bg-red-50/40 flex items-start space-x-2.5">
              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold">Submitting Real Credentials:</strong>
                <span className="text-slate-600 ml-1">
                  Pasting active banking passwords, debit card PINs, CVVs, or live SMS OTP authentication tokens.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">3. Enforcement and Rate Limiting</h2>
          <p>
            To protect infrastructure availability for users under active threat, excessive request frequencies or malformed payloads will be automatically throttled or blocked via HTTP 429 status codes.
          </p>
        </section>
      </div>
    </div>
  );
};
