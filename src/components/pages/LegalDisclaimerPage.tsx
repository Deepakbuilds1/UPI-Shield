import React from 'react';
import { AlertTriangle, ArrowLeft, PhoneCall, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PageProps {
  onNavigateHome: () => void;
  onNavigateHelp: () => void;
}

export const LegalDisclaimerPage: React.FC<PageProps> = ({ onNavigateHome, onNavigateHelp }) => {
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
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
          <AlertTriangle className="w-4 h-4" />
          <span>Operational & Legal Boundaries</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight">
          Legal & Operational Disclaimer
        </h1>
        <p className="text-xs text-slate-500">
          Important notice regarding the scope and limitations of AI-assisted payment risk scoring
        </p>
      </div>

      {/* Primary Notice Box */}
      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 space-y-3">
        <div className="flex items-center space-x-2.5 text-amber-900 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
          <span>Not a Substitute for Independent Verification</span>
        </div>
        <p className="text-xs text-amber-950 leading-relaxed">
          UPI-Shield operates as a pre-authorization educational aid. It analyses syntactic urgency, psychological triggers, and payment link coordinates. It does <strong>not</strong> have real-time visibility into police criminal registries, banking ledger disputes, or whether a counterparty bank account is currently compromised.
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">1. Absence of Banking Certification</h2>
          <p>
            No score, classification, or recommendation issued by this application represents an official clearance, safety certification, or legal determination by any regulatory authority (such as the Reserve Bank of India, Indian Cyber Crime Coordination Centre (I4C), or National Payments Corporation of India).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">2. False Positives and False Negatives</h2>
          <p>
            Algorithmic natural language analysis may occasionally produce:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>False Positives:</strong> High risk ratings on legitimate messages that utilize urgent phrasing (e.g. authentic utility reminders or airline flash sales).</li>
            <li><strong>False Negatives:</strong> Low risk ratings on emerging scam patterns that mimic official communications without conventional coercive vocabulary.</li>
          </ul>
          <p className="text-xs text-slate-500 pt-1">
            Always verify sender authenticity directly through customer support numbers found on the back of your debit/credit card or on official utility bill receipts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">3. If You Have Transferred Funds to a Fraudster</h2>
          <p>
            If you have already authorized a transaction or shared credentials:
          </p>
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-950 space-y-2 text-xs">
            <div className="flex items-center space-x-2 font-bold text-red-800">
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>Immediate Golden-Hour Incident Reporting</span>
            </div>
            <p>
              Call the <strong>National Cyber Crime Helpline at 1930</strong> immediately within the first 2 hours of payment to request an emergency transaction freeze before funds leave the beneficiary account.
            </p>
            <button
              type="button"
              onClick={onNavigateHelp}
              className="mt-1 inline-flex items-center space-x-1.5 font-bold text-red-700 underline hover:text-red-900 cursor-pointer"
            >
              <span>View Emergency Incident Response Protocol →</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
