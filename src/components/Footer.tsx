import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'disclaimer' | null>(null);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="border-t border-slate-200 bg-white text-slate-600 py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left brand info */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-[#0B1F33] text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-bold text-[#0B1F33] text-sm">
                  UPI-Shield
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Contextual Digital Payment Scam Detection
              </p>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600">
              <button
                type="button"
                onClick={() => handleScrollTo('education-section')}
                className="hover:text-[#0B1F33] transition-colors cursor-pointer"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => handleScrollTo('safety-guide-section')}
                className="hover:text-[#0B1F33] transition-colors cursor-pointer"
              >
                Safety Guide
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('privacy')}
                className="hover:text-[#0B1F33] transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('disclaimer')}
                className="hover:text-[#0B1F33] transition-colors cursor-pointer"
              >
                Disclaimer
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
            <p>
              UPI-Shield provides an AI-assisted risk assessment and does not guarantee that a message is fraudulent or legitimate.
            </p>
            <p className="font-mono text-[11px] text-slate-400 shrink-0">
              © {new Date().getFullYear()} UPI-Shield. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-lg text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-[#0B1F33]">Privacy Policy</h4>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                UPI-Shield adheres strictly to privacy-by-design principles:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Messages submitted for analysis are processed ephemerally and are not permanently retained in any database.</li>
                <li>No user bank accounts, mobile numbers, passwords, or transaction histories are stored or indexed.</li>
                <li>Never submit private credentials such as your secret UPI PIN, OTP, or debit card CVV.</li>
              </ul>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-9 px-4 rounded-lg text-xs font-semibold text-white bg-[#0B1F33] hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer Modal */}
      {activeModal === 'disclaimer' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-lg text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-[#0B1F33]">Legal & Operational Disclaimer</h4>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                UPI-Shield provides contextual cognitive analysis as an informational pre-authorization aid.
              </p>
              <p>
                Risk scores and warnings are generated via algorithmic natural language heuristics and multimodal AI models. They do not constitute official financial, legal, or banking certifications.
              </p>
              <p>
                Always independently verify any request involving funds, bank accounts, or credentials through verified official telephone lines or authorized physical branches.
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-9 px-4 rounded-lg text-xs font-semibold text-white bg-[#0B1F33] hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
