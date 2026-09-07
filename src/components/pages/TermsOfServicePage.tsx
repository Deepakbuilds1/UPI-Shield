import React from 'react';
import { FileText, ArrowLeft, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PageProps {
  onNavigateHome: () => void;
}

export const TermsOfServicePage: React.FC<PageProps> = ({ onNavigateHome }) => {
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
          <FileText className="w-4 h-4" />
          <span>User Agreement & Conditions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">
          Effective Date: September 2026 • Please read carefully before using this application
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">1. Nature of the Service</h2>
          <p>
            UPI-Shield is an informational, cognitive risk-scoring tool intended to provide pre-authorization guidance when reviewing suspicious digital payment requests, SMS messages, and UPI intent links.
          </p>
          <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800">
            <strong>Non-Affiliation Notice:</strong> UPI-Shield is an independent security research project. It is not affiliated with, endorsed by, or operated by the National Payments Corporation of India (NPCI), the Reserve Bank of India (RBI), Google Pay, PhonePe, Paytm, or any banking institution.
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">2. Informational Aid Only & No Guarantee</h2>
          <p>
            Threat scores (0–100), risk categorizations (SAFE, LOW, MEDIUM, HIGH, CRITICAL), and signal breakdowns are generated using natural language heuristic evaluation and multimodal AI models.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>An assessment of "SAFE" or "LOW" does <strong>not</strong> guarantee that a message or counterparty is genuine. Attackers continually invent new pretext techniques.</li>
            <li>An assessment of "HIGH" or "CRITICAL" represents probabilistic warning indicators and should prompt independent verification through official telephone channels.</li>
            <li>UPI-Shield does not make financial decisions on your behalf and cannot reverse, cancel, or stop payment transactions.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">3. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Submit malicious code, viruses, or exploit payloads through the text or image upload endpoints.</li>
            <li>Attempt to reverse-engineer, decompile, or launch automated denial-of-service (DDoS) attacks against the API.</li>
            <li>Use the scoring engine to test or refine criminal phishing campaigns to evade detection filters.</li>
            <li>Input confidential credentials such as bank account passwords, debit card PINs, or UPI MPINs.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">4. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, the maintainers of UPI-Shield shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from unauthorized payment authorizations, financial loss, reliance on risk scores, or service unavailability.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">5. Modifications to Service</h2>
          <p>
            We reserve the right to modify, enhance, or temporarily suspend the analysis service or individual heuristic models at any time without prior notice.
          </p>
        </section>
      </div>
    </div>
  );
};
