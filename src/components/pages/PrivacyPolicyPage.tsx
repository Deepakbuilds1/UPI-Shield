import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Database, EyeOff, Cpu, RefreshCw } from 'lucide-react';

interface PageProps {
  onNavigateHome: () => void;
}

export const PrivacyPolicyPage: React.FC<PageProps> = ({ onNavigateHome }) => {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 space-y-8 text-left font-sans">
      {/* Back button */}
      <button
        type="button"
        onClick={onNavigateHome}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-[#0B1F33] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Threat Analyzer</span>
      </button>

      {/* Header */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#0F766E]">
          <ShieldCheck className="w-4 h-4" />
          <span>Transparency & Privacy Documentation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: September 2026 • Verified against implementation architecture
        </p>
      </div>

      {/* Key Architectural Privacy Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
            <EyeOff className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900">Ephemeral Processing</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Message text and screenshot OCR images are processed strictly in server memory and discarded immediately upon response.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2">
            <Database className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900">Zero Persistent Database</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            UPI-Shield operates with zero persistent user databases. No user phone numbers, UPI IDs, or logs are written to disk.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
            <Lock className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900">Zero Credential Collection</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            We never request, accept, or store your secret UPI MPIN, bank account passwords, or card CVV credentials.
          </p>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">1. Information We Process</h2>
          <p>
            UPI-Shield is a pre-authorization safety utility designed to evaluate psychological pressure and technical scam markers. We process only the data explicitly submitted by the user:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Payment message text:</strong> SMS notifications, WhatsApp messages, or payment requests pasted into the input field.</li>
            <li><strong>Screenshot image payloads:</strong> Screenshots uploaded for OCR text extraction via <code>POST /api/ocr</code>.</li>
            <li><strong>Language preference:</strong> User-selected analysis language (English, Hindi, Hinglish, or auto-detect).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">2. How We Use and Process Data</h2>
          <p>
            Data submitted to UPI-Shield is used solely for immediate threat scoring:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Identifying coercion tactics (artificial countdowns, impersonation of authority, electricity disconnection threats).</li>
            <li>Evaluating UPI intent URIs (e.g., verifying payee address, payee name, transaction notes, and nominal amounts).</li>
            <li>Generating bilingual safety warnings and protective action recommendations.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">3. Third-Party AI Sub-Processors</h2>
          <p>
            When configured with a Gemini API key, UPI-Shield communicates with Google Generative AI services (<code>gemini-3.8-flash</code> and <code>gemini-3.1-flash-lite</code>) via encrypted HTTPS:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Data transmitted to the Gemini API is processed pursuant to Google enterprise API terms, which state that API customer prompts are not used to train foundational models.</li>
            <li>If external AI endpoints are unavailable or during connection disruption, analysis is automatically performed on-server via the built-in zero-dependency local heuristic engine.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">4. Cookies & Browser Storage</h2>
          <p>
            UPI-Shield uses <strong>zero third-party advertising cookies, analytics pixels, or cross-site tracking technologies</strong>. Standard browser <code>localStorage</code> may be utilized solely to store local client preferences (such as language selection or dark mode preferences).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">5. User Security Responsibilities</h2>
          <p className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
            <strong>CRITICAL WARNING:</strong> Never enter or submit your secret 4-digit or 6-digit UPI MPIN, One-Time Passwords (OTPs), net banking passwords, or card security codes (CVV) into UPI-Shield or any other web service. UPI PIN is required solely on the official UPI payment screen to send funds.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">6. Contact & Privacy Inquiries</h2>
          <p>
            If you have questions regarding this privacy policy or data handling practices, contact the maintainers via the support channel at <code>security@upi-shield.local</code> or file an inquiry via the Help Center.
          </p>
        </section>
      </div>
    </div>
  );
};
