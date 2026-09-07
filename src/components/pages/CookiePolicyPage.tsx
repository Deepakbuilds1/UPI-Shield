import React from 'react';
import { Cookie, ArrowLeft, CheckCircle2, Info } from 'lucide-react';

interface PageProps {
  onNavigateHome: () => void;
}

export const CookiePolicyPage: React.FC<PageProps> = ({ onNavigateHome }) => {
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
          <Cookie className="w-4 h-4" />
          <span>Storage & Tracking Disclosures</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight">
          Cookie & Browser Storage Disclosure
        </h1>
        <p className="text-xs text-slate-500">
          Factual audit of browser cookies, local storage, and tracking technologies
        </p>
      </div>

      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start space-x-3 text-xs sm:text-sm text-emerald-950">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold mb-0.5">Zero Tracking Cookies Used</strong>
          <span>
            UPI-Shield does not set any third-party tracking cookies, advertising beacons, or analytics tracking identifiers.
          </span>
        </div>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">1. What We Store Locally in Your Browser</h2>
          <p>
            Because we do not run third-party advertising networks or marketing analytics scripts, we only use standard client-side browser storage for essential interface convenience:
          </p>
          <div className="rounded-lg border border-slate-200 overflow-hidden mt-3">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="p-3">Storage Key</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                <tr>
                  <td className="p-3 font-mono font-medium text-slate-800">upi_shield_lang</td>
                  <td className="p-3">localStorage</td>
                  <td className="p-3">Remembers your preferred language (English, Hindi, Hinglish)</td>
                  <td className="p-3">Persistent on device</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-medium text-slate-800">None (Cookies)</td>
                  <td className="p-3">HTTP Cookie</td>
                  <td className="p-3">Zero tracking cookies set</td>
                  <td className="p-3">N/A</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">2. Why We Do Not Require a Cookie Consent Banner</h2>
          <p>
            Under international privacy regulations (such as GDPR, ePrivacy Directive, and India's DPDP Act), consent banners are specifically required when services use non-essential advertising or profiling cookies. Because UPI-Shield uses zero non-essential tracking cookies, displaying an artificial consent banner would be misleading and unnecessary.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">3. How to Clear Browser Data</h2>
          <p>
            You can wipe any locally stored settings at any time by opening your browser's Developer Tools or Settings and selecting "Clear Site Data" or "Clear Local Storage".
          </p>
        </section>
      </div>
    </div>
  );
};
