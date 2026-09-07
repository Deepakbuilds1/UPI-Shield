import React, { useState } from 'react';
import { Languages, Globe } from 'lucide-react';

interface BilingualScamLensProps {
  englishExplanation: string;
  hindiExplanation?: string;
  detectedLanguage?: string;
}

export const BilingualScamLens: React.FC<BilingualScamLensProps> = ({
  englishExplanation,
  hindiExplanation,
  detectedLanguage = 'English',
}) => {
  const [activeLang, setActiveLang] = useState<'en' | 'hi'>('hi');

  if (!hindiExplanation && !englishExplanation) return null;

  return (
    <div
      id="bilingual-scamlens-card"
      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs space-y-3"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center space-x-2">
          <Languages className="w-4 h-4 text-teal-700" />
          <h4 className="text-sm font-bold text-[#0B1F33]">
            Bilingual Manipulation Guidance
          </h4>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveLang('hi')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
              activeLang === 'hi'
                ? 'bg-white text-[#0B1F33] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिंदी (Hindi)
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
              activeLang === 'en'
                ? 'bg-white text-[#0B1F33] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-lg">
        {activeLang === 'hi' ? (
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              मनोवैज्ञानिक हेरफेर का विवरण (Hindi)
            </span>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {hindiExplanation ||
                'यह संदेश आपको तुरंत भुगतान करने या गोपनीय जानकारी साझा करने के लिए भावनात्मक रूप से दबाव में डालने का प्रयास करता है।'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Manipulation Narrative (English)
            </span>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {englishExplanation}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <span>
          Detected linguistic pattern:{' '}
          <strong className="text-slate-700 font-semibold">{detectedLanguage}</strong>
        </span>
      </div>
    </div>
  );
};
