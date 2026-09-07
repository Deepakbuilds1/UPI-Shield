import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Key, Terminal, Bug } from 'lucide-react';

interface PageProps {
  onNavigateHome: () => void;
}

export const SecurityPolicyPage: React.FC<PageProps> = ({ onNavigateHome }) => {
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
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#0F766E]">
          <ShieldCheck className="w-4 h-4" />
          <span>Security Architecture & Vulnerability Reporting</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight">
          Security Policy & Responsible Disclosure
        </h1>
        <p className="text-xs text-slate-500">
          Technical safeguards, data hygiene, and vulnerability disclosure guidelines
        </p>
      </div>

      {/* Security Architecture Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900">Transport Layer Security</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            All client-to-server traffic is encrypted using modern TLS 1.3/HTTPS. Unencrypted HTTP traffic is rejected.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Key className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900">Server-Side Secret Isolation</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Gemini API keys and upstream credentials reside exclusively on the server process and are never sent to the client browser.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Terminal className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900">Sanitized Runtime Logging</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Error logs do not store or mirror customer text payloads. Stack traces are sanitized before sending responses to clients.
          </p>
        </div>
      </div>

      {/* Detailed Technical Measures */}
      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">1. Ephemeral In-Memory Execution</h2>
          <p>
            When a user requests analysis via <code>POST /api/analyze</code>:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>The message is processed directly in Node.js heap memory.</li>
            <li>No records, database rows, or temporary log files containing the submitted message or extracted phone numbers are written to the server filesystem.</li>
            <li>The memory buffer is cleared as soon as the JSON response stream is closed.</li>
          </ul>
        </section>

        <section id="disclosure" className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center space-x-2 text-[#0B1F33]">
            <Bug className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold">2. Responsible Vulnerability Disclosure Program</h2>
          </div>
          <p>
            We welcome responsible security researchers who identify potential vulnerabilities in our web service, dependency chain, or API configurations.
          </p>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
            <span className="font-semibold text-slate-900 block">Guidelines for Responsible Reporting:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              <li>Submit vulnerability details via encrypted email to: <code>security@upi-shield.local</code>.</li>
              <li>Provide sufficient reproducible details (curl command, HTTP request payload, or test case).</li>
              <li>Allow a reasonable disclosure window (at least 30 days) before publishing findings publicly.</li>
              <li>Do not access or attempt to access other users' data or conduct disruptive denial-of-service tests.</li>
            </ul>
          </div>

          <p className="text-xs text-slate-500">
            <strong>Safe Harbor:</strong> Activities conducted in good faith and in compliance with these guidelines will not be subject to legal action by the project maintainers.
          </p>
        </section>
      </div>
    </div>
  );
};
