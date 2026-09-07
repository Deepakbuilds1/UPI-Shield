import React, { useState } from 'react';
import { SignalBreakdown, AnalysisResponse } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TechnicalAnalysisCardProps {
  technical: AnalysisResponse['technical_analysis'];
  signalBreakdown: SignalBreakdown;
  riskScore: number;
}

export const TechnicalAnalysisCard: React.FC<TechnicalAnalysisCardProps> = ({
  technical,
  signalBreakdown,
  riskScore,
}) => {
  const [expanded, setExpanded] = useState(false);

  const signalItems = [
    { label: 'Urgency Pressure', value: signalBreakdown.urgency, weight: '15%' },
    { label: 'Fear & Intimidation', value: signalBreakdown.fear, weight: '15%' },
    { label: 'Authority Impersonation', value: signalBreakdown.authority_impersonation, weight: '15%' },
    { label: 'Payment Pressure', value: signalBreakdown.payment_pressure, weight: '15%' },
    { label: 'Credential Request (PIN/OTP)', value: signalBreakdown.credential_request, weight: '15%' },
    { label: 'Verification Pretext', value: signalBreakdown.verification_pretext, weight: '10%' },
    { label: 'Remote Access Tool', value: signalBreakdown.remote_access_request, weight: '10%' },
    { label: 'QR Misdirection', value: signalBreakdown.qr_payment_request, weight: '10%' },
    { label: 'Suspicious Link', value: signalBreakdown.suspicious_link, weight: '10%' },
    { label: 'Coercion Signals', value: signalBreakdown.coercion, weight: '10%' },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 block">
            System Breakdown
          </span>
          <h3 className="text-base font-bold text-[#0B1F33]">
            Technical Risk Weights
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-[#0F766E] hover:text-[#0b544e] cursor-pointer"
        >
          <span>{expanded ? 'Hide Weights' : 'Show Multi-Signal Weights'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">
            Semantic NLP (60%)
          </span>
          <span className="text-base font-bold text-[#0B1F33] font-mono">
            {technical.semantic_score}
            <span className="text-xs text-slate-400 font-normal"> / 60</span>
          </span>
          <span className="text-xs text-slate-500 block mt-0.5">
            Language context & intent
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">
            Behavioral Coercion (25%)
          </span>
          <span className="text-base font-bold text-[#0B1F33] font-mono">
            {technical.behavioral_score}
            <span className="text-xs text-slate-400 font-normal"> / 25</span>
          </span>
          <span className="text-xs text-slate-500 block mt-0.5">
            Threat & urgency dynamics
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">
            Technical Payment (15%)
          </span>
          <span className="text-base font-bold text-[#0B1F33] font-mono">
            {technical.technical_payment_score}
            <span className="text-xs text-slate-400 font-normal"> / 15</span>
          </span>
          <span className="text-xs text-slate-500 block mt-0.5">
            VPA, URL & ₹1 trap checks
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
        <div>
          <span>Engine: </span>
          <span className="font-semibold text-slate-700">
            {technical.engine_mode === 'gemini-ai'
              ? 'Multimodal Gemini 3.8 Flash + Safety Heuristics'
              : technical.engine_mode === 'gemini-flash-lite'
              ? 'Gemini 3.1 Flash Lite (High-Availability Engine)'
              : 'Local Safety Heuristics Engine (Resilient Fallback)'}
          </span>
        </div>
        <span className="font-mono text-xs">
          Processed at {new Date(technical.processed_at).toLocaleTimeString()}
        </span>
      </div>

      {expanded && (
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
            <span>Signal Category</span>
            <span>Index (0.00 – 1.00)</span>
          </div>

          <div className="space-y-2">
            {signalItems.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    {item.label} <span className="text-xs text-slate-400">({item.weight})</span>
                  </span>
                  <span className="font-mono font-semibold text-slate-900">
                    {item.value.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.value > 0.6
                        ? 'bg-[#B91C1C]'
                        : item.value > 0.3
                        ? 'bg-[#B45309]'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${Math.round(item.value * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
