import React, { useState } from 'react';
import {
  LifeBuoy,
  ArrowLeft,
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Ban,
  Building2,
  Lock,
} from 'lucide-react';

interface PageProps {
  onNavigateHome: () => void;
}

export const IncidentHelpCenterPage: React.FC<PageProps> = ({ onNavigateHome }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="max-w-[950px] mx-auto px-4 sm:px-6 py-10 space-y-10 text-left font-sans">
      <button
        type="button"
        onClick={onNavigateHome}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-[#0B1F33] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Threat Analyzer</span>
      </button>

      {/* Hero / Header */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#0F766E]">
          <LifeBuoy className="w-4 h-4" />
          <span>Emergency Fraud Triage & Help Desk</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight">
          Incident Response & Safety Help Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Immediate actionable steps if you are facing coercion, suspect a fraudulent request, or have mistakenly transferred funds.
        </p>
      </div>

      {/* Immediate Emergency Action Box: The Golden Hour */}
      <div className="rounded-xl border border-red-200 bg-red-50/70 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-red-200/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 block">
                Immediate Action Required
              </span>
              <h2 className="text-base sm:text-lg font-bold text-red-950">
                Transferred Money Under a Scam? Act in the "Golden Hour"
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:1930"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 1930 (Helpline)</span>
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white border border-red-300 text-red-900 text-xs font-semibold hover:bg-red-50 transition-colors"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3 text-red-600" />
            </a>
          </div>
        </div>

        {/* 4 Emergency Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-white border border-red-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-red-700 font-bold">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px]">1</span>
              <span>Call 1930 Helpline</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Report the transaction within 2 hours. The National Cyber Crime Coordination Centre (I4C) can freeze funds before the fraudster withdraws them.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-red-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-red-700 font-bold">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px]">2</span>
              <span>Call Bank to Freeze</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Contact your bank's 24x7 toll-free fraud helpline to place a lien or freeze on the compromised debit card or netbanking profile.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-red-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-red-700 font-bold">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px]">3</span>
              <span>Block VPA in UPI App</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              In Google Pay, PhonePe, Paytm, or BHIM, go to the transaction, tap "Report Issue / Spam", and block the receiver VPA.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-white border border-red-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-red-700 font-bold">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px]">4</span>
              <span>Lodge Written Cyber FIR</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Save screenshots of chat logs, UPI Ref numbers (UTR), and caller numbers. Submit an official incident report on cybercrime.gov.in.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions regarding UPI Threats */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#0B1F33]">
          Frequently Asked Questions & Threat Education
        </h2>

        <div className="space-y-2.5">
          {[
            {
              q: 'Can entering my UPI PIN ever receive money or claim a refund?',
              a: 'NO. NEVER. Under no circumstance does entering your UPI PIN credit money into your account. The UPI PIN is strictly used to authenticate funds leaving your bank account. Scammers frequently claim "Enter PIN to verify and receive ₹5,000 refund" — this is always a scam that debits your account.',
            },
            {
              q: 'Why did I receive an urgent SMS saying electricity will be disconnected tonight?',
              a: 'This is one of the most common payment scams in India. Power distribution companies (DISCOMs) never send urgent termination notices from personal 10-digit mobile numbers advising you to call an "officer" or pay on a personal UPI VPA. Legitimate bill reminders come via registered alphanumeric sender headers (e.g. VK-BESCOM, MD-TATA).',
            },
            {
              q: 'What is the "₹1 or ₹5 Verification" trap?',
              a: 'Fraudsters send a UPI Autopay mandate or collect request disguised as a ₹1 "account verification" transfer. Once you authorize the prompt with your MPIN, you may unintentionally activate a recurring e-mandate allowing the fraudster to debit up to ₹15,000 automatically in subsequent cycles without further approval.',
            },
            {
              q: 'Why should I never install AnyDesk, TeamViewer, or QuickSupport on caller instructions?',
              a: 'These are legitimate remote desktop management tools. However, once installed, the attacker can view your smartphone screen in real-time. As you enter your netbanking password or receive an OTP, the attacker captures it instantly, giving them full control over your financial accounts.',
            },
            {
              q: 'What should I do if someone on OLX/Marketplace sends a QR code to pay me for an item?',
              a: 'Scanning a QR code debits your bank balance. You only scan QR codes to pay a merchant in a store or settle a bill. If a prospective buyer sends you a QR code to "pay you", do NOT scan it; it is a collect request designed to steal your money.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left flex items-center justify-between font-semibold text-xs sm:text-sm text-[#0B1F33] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{item.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Official Directory of National Helplines */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#0B1F33]">Official National Indian Fraud Response Directory</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">National Cyber Helpline</span>
            <p className="text-slate-600">Toll-free emergency dial: <strong className="text-slate-900">1930</strong></p>
            <p className="text-slate-500 text-[11px]">Operated by MHA / I4C</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Cyber Crime Portal</span>
            <p className="text-slate-600">URL: <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="text-[#0F766E] underline">cybercrime.gov.in</a></p>
            <p className="text-slate-500 text-[11px]">Official Government FIR Filing</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block">Chakshu Portal (DoT)</span>
            <p className="text-slate-600">Report suspected fraud SMS or calls</p>
            <p className="text-slate-500 text-[11px]">sancharsaathi.gov.in</p>
          </div>
        </div>
      </div>
    </div>
  );
};
