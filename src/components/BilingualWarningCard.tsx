import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check } from 'lucide-react';

interface BilingualWarningCardProps {
  englishWarning: string;
  hindiWarning: string;
}

export const BilingualWarningCard: React.FC<BilingualWarningCardProps> = ({
  englishWarning,
  hindiWarning,
}) => {
  const [activeLang, setActiveLang] = useState<'en' | 'hi'>('en');
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentText = activeLang === 'en' ? englishWarning : hindiWarning;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentText);
    utterance.lang = activeLang === 'en' ? 'en-IN' : 'hi-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 block">
            Safety Warning
          </span>
          <h3 className="text-base font-bold text-[#0B1F33]">
            Plain-Language Advisory
          </h3>
        </div>

        {/* Clean Language Toggle */}
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setActiveLang('en');
              if (isPlaying) window.speechSynthesis?.cancel();
              setIsPlaying(false);
            }}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeLang === 'en'
                ? 'bg-white text-[#0B1F33] font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveLang('hi');
              if (isPlaying) window.speechSynthesis?.cancel();
              setIsPlaying(false);
            }}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeLang === 'hi'
                ? 'bg-white text-[#0B1F33] font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Warning Box */}
      <div className="p-4 rounded-lg bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between space-y-3">
        <p className="text-[15px] text-[#0B1F33] font-medium leading-relaxed">
          "{currentText}"
        </p>

        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <span>{activeLang === 'en' ? 'Independently verify before authorizing' : 'भुगतान से पहले स्वतंत्र रूप से पुष्टि करें'}</span>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleSpeak}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Listen to advisory"
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-600" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Listen</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Copy warning text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
