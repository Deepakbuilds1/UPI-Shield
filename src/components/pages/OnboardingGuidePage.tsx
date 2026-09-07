import React, { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, MessageSquare, Camera, Link2, ShieldCheck, Check } from 'lucide-react';

interface PageProps {
  onNavigateHome: () => void;
}

export const OnboardingGuidePage: React.FC<PageProps> = ({ onNavigateHome }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '1. Paste Suspicious Message or SMS',
      icon: MessageSquare,
      headline: 'Analyze Text Before Authorizing Payments',
      content:
        'When you receive an urgent message on WhatsApp, SMS, or Telegram claiming electricity cut-off, courier holds, or lottery wins, copy the entire message and paste it into the analyzer. UPI-Shield extracts the emotional triggers, urgency words, and phone numbers.',
      tip: 'Do not edit out phone numbers or payment links; the engine examines payee syntax to identify impersonation.',
    },
    {
      title: '2. Upload Screenshot for Vision OCR',
      icon: Camera,
      headline: 'Instant Screenshot Extraction',
      content:
        'If you received a screenshot of a transaction request or chat window, click "Upload Screenshot" to have our Multimodal Vision engine automatically transcribe all text, payment amounts, and payee VPAs directly into the analyzer.',
      tip: 'Images are processed ephemerally in server memory and are never saved to disk.',
    },
    {
      title: '3. Inspect UPI Deep Links & QR Codes',
      icon: Link2,
      headline: 'Inspect Payee Address & Merchant Codes',
      content:
        'Attackers often embed deep links (like upi://pay?pa=scammer@upi&am=1) inside messages. Click "UPI Inspector" to break down the exact Payee Address (VPA), Merchant Category Code, and verify if it is an individual account posing as a corporation.',
      tip: 'Look out for personal handles (@okhdfcbank, @ybl) used by claimed government DISCOMs or banks.',
    },
    {
      title: '4. Read the Contextual Threat Report',
      icon: ShieldCheck,
      headline: 'Multi-Signal Threat Score & Bilingual Advisory',
      content:
        'The verification report displays an overall Threat Score (0–100), detected scam typologies, and an immediate actionable warning in both English and Hindi. If the status is HIGH or CRITICAL, stop the payment immediately.',
      tip: 'Remember: You NEVER need to enter your UPI PIN or scan a QR code to receive money.',
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="max-w-[850px] mx-auto px-4 sm:px-6 py-10 space-y-8 text-left font-sans">
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
          <Sparkles className="w-4 h-4" />
          <span>Interactive User Onboarding</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight">
          How to Use UPI-Shield in 4 Simple Steps
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Learn how to quickly evaluate payment requests and protect yourself against psychological coercion.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {steps.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentStep(idx)}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              currentStep === idx
                ? 'bg-white border-[#0B1F33] shadow-xs ring-1 ring-[#0B1F33]'
                : currentStep > idx
                ? 'bg-slate-50 border-emerald-200 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span>Step {idx + 1}</span>
              {currentStep > idx && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </div>
            <span className="text-[11px] block font-medium truncate">{s.title.split('. ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Active Step Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-[#0B1F33] text-white flex items-center justify-center shrink-0">
            <StepIcon className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
              {step.title}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0B1F33]">
              {step.headline}
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {step.content}
        </p>

        <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs flex items-start space-x-2.5">
          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">Safety Pro-Tip:</strong>
            <span>{step.tip}</span>
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            Previous Step
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-[#0B1F33] hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Launch Threat Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
