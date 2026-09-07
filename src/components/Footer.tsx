import React from 'react';
import { ShieldCheck, ExternalLink, LifeBuoy, Lock, Cookie, Eye, FileText, AlertTriangle } from 'lucide-react';
import { AppRoute } from '../types';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
  onScrollToEducation?: () => void;
  onScrollToSafetyGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onScrollToEducation,
  onScrollToSafetyGuide,
}) => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 pt-12 pb-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {/* Col 1: Brand & Architecture */}
          <div className="md:col-span-1 space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-left cursor-pointer group"
            >
              <div className="w-7 h-7 rounded bg-[#0B1F33] text-white flex items-center justify-center transition-colors group-hover:bg-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-bold text-[#0B1F33] text-base">
                UPI-Shield
              </span>
            </button>
            <p className="text-xs text-slate-500 leading-relaxed">
              Contextual Digital Payment Scam & Coercion Detector for UPI transactions with semantic NLP analysis, psychological threat scoring, and bilingual advisories.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium text-emerald-800 bg-emerald-50 border border-emerald-200">
                Privacy by Design • Zero Logs
              </span>
            </div>
          </div>

          {/* Col 2: Threat Verification & Tools - Issues 5, 19 */}
          <div className="space-y-3 text-xs">
            <h3 className="font-semibold text-sm text-[#0B1F33]">
              Analysis & Safety
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="ui-link text-sm cursor-pointer text-left"
                >
                  Payment Threat Analyzer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('onboarding')}
                  className="ui-link text-sm cursor-pointer text-left"
                >
                  Quick-Start Onboarding Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => onScrollToEducation?.(), 100);
                  }}
                  className="ui-link text-sm cursor-pointer text-left"
                >
                  The Pre-Auth Security Gap
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => onScrollToSafetyGuide?.(), 100);
                  }}
                  className="ui-link text-sm cursor-pointer text-left"
                >
                  Core Rules for UPI Security
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Governance - Issues 6, 19 */}
          <div className="space-y-3 text-xs">
            <h3 className="font-semibold text-sm text-[#0B1F33]">
              Transparency & Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="ui-link text-sm cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('terms')}
                  className="ui-link text-sm cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('disclaimer')}
                  className="ui-link text-sm cursor-pointer text-left"
                >
                  Legal & Operational Disclaimer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('acceptable-use')}
                  className="ui-link text-sm cursor-pointer text-left"
                >
                  Acceptable Use Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('security')}
                  className="ui-link text-sm cursor-pointer text-left"
                >
                  Security & Responsible Disclosure
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cookies')}
                  className="ui-link text-sm cursor-pointer text-left"
                >
                  Cookie & Browser Storage Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('accessibility')}
                  className="ui-link text-sm cursor-pointer text-left"
                >
                  Accessibility Statement
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency Response & Helplines - Issues 20, 21 */}
          <div className="space-y-3 text-xs">
            <h3 className="font-semibold text-sm text-[#0B1F33]">
              Emergency Triage
            </h3>
            <p className="text-sm text-slate-500 leading-6">
              If you have transferred funds under a coercion pretext, report immediately to national hotlines:
            </p>
            <div className="space-y-3 pt-1">
              <a
                href="tel:1930"
                className="mt-3 inline-flex items-center min-h-10 px-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 font-semibold hover:bg-red-100 transition-colors focus-visible:outline-2 focus-visible:outline-[#0F766E] focus-visible:outline-offset-2"
              >
                <span>National Cyber Helpline: 1930</span>
              </a>
              <div>
                <button
                  type="button"
                  onClick={() => onNavigate('help')}
                  className="ui-link text-sm font-medium cursor-pointer block text-left"
                >
                  View Step-by-Step Incident Help Center
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Issue 7 */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            UPI-Shield provides AI-assisted cognitive risk analysis as an informational pre-authorization guide. Always independently verify suspicious payment requests.
          </p>
          <p className="text-xs text-slate-500 shrink-0">
            © {new Date().getFullYear()} UPI-Shield. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
