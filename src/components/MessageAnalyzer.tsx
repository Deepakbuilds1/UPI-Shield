import React, { useState } from 'react';
import {
  ShieldAlert,
  RotateCcw,
  Upload,
  Link2,
  Check,
  Globe,
  Loader2,
  FileText,
  Eye,
  Sparkles,
} from 'lucide-react';
import { DEMO_MESSAGES, HACKATHON_DEMO, SCAMLENS_DEMOS } from '../data/demoMessages';

interface MessageAnalyzerProps {
  inputText: string;
  setInputText: (text: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isLoading: boolean;
  onAnalyze: () => void;
  onOpenScreenshot: () => void;
  onOpenUpiTool: () => void;
  onOpenTestCases: () => void;
  onTryScamLensDemo?: () => void;
}

export const MessageAnalyzer: React.FC<MessageAnalyzerProps> = ({
  inputText,
  setInputText,
  selectedLanguage,
  setSelectedLanguage,
  isLoading,
  onAnalyze,
  onOpenScreenshot,
  onOpenUpiTool,
  onOpenTestCases,
  onTryScamLensDemo,
}) => {
  const [activeSource, setActiveSource] = useState<'SMS' | 'WhatsApp' | 'Email' | 'Payment Note' | 'UPI Request'>('SMS');

  const sources = ['SMS', 'WhatsApp', 'Email', 'Payment Note', 'UPI Request'] as const;

  const handleQuickLoad = (query: string) => {
    // Check SCAMLENS_DEMOS first
    const scDemo = SCAMLENS_DEMOS.find((d) => d.id === query || d.title.toLowerCase().includes(query.toLowerCase()));
    if (scDemo) {
      setInputText(scDemo.text);
      return;
    }

    // Check general test cases
    const found = DEMO_MESSAGES.find(
      (m) =>
        m.id === query ||
        m.id.toLowerCase().includes(query.toLowerCase()) ||
        m.title.toLowerCase().includes(query.toLowerCase())
    );
    if (found) {
      setInputText(found.text);
    } else if (query === 'electricity') {
      setInputText(HACKATHON_DEMO.text);
    }
  };

  const handleRandomExample = () => {
    const sample = DEMO_MESSAGES[Math.floor(Math.random() * DEMO_MESSAGES.length)];
    setInputText(sample.text);
  };

  const handleClear = () => {
    setInputText('');
  };

  return (
    <div
      id="analyzer-section"
      className="max-w-[850px] mx-auto bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-[20px] font-semibold text-[#0B1F33] tracking-tight">
            Analyze a suspicious message
          </h2>
          <p className="text-[14px] text-slate-600 mt-1">
            Paste an SMS, WhatsApp message, payment note or suspicious request to check for scam indicators.
          </p>
        </div>

        {/* Source selector - Issues 9, 12, 16 */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">Source:</span>
          {sources.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveSource(src)}
              className={`source-button ${
                activeSource === src
                  ? 'bg-[#0B1F33] text-white border-[#0B1F33]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {src}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="space-y-2.5">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
            maxLength={8000}
            placeholder="Paste the message you received..."
            disabled={isLoading}
            className="w-full p-4 rounded-lg border border-slate-300 focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] text-[15px] text-[#0B1F33] placeholder:text-slate-400 resize-y transition-colors leading-relaxed outline-hidden disabled:bg-slate-50"
          />

          {inputText && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3 right-3 p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear text"
              aria-label="Clear input text"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sub-bar: Language mode and Character count */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">Detected language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={isLoading}
              className="px-2 py-1 rounded border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-hidden focus:border-[#0F766E] cursor-pointer"
            >
              <option value="auto">Auto (English / Hinglish / Hindi)</option>
              <option value="English">English</option>
              <option value="Hinglish">Hinglish</option>
              <option value="Hindi">हिंदी (Hindi)</option>
            </select>
          </div>

          <div className="text-[12px] text-slate-400 font-mono">
            {inputText.length} / 8000 characters
          </div>
        </div>
      </div>

      {/* Loading Progress State (Disciplined & Professional with Accessibility) */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2"
        >
          <div className="flex items-center space-x-2 text-sm font-semibold text-[#0B1F33]">
            <Loader2 className="w-4 h-4 animate-spin text-[#0F766E]" />
            <span>Analyzing message context & psychological triggers...</span>
          </div>
          <div className="text-xs text-slate-600 space-y-1 pl-6">
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verifying conversational context & timeline urgency</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Scanning authority impersonation and coercion markers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Checking payment amounts & UPI payee coordinate validity</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State Help when text is cleared */}
      {!inputText.trim() && !isLoading && (
        <div className="p-3 bg-slate-50/70 rounded-lg border border-dashed border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Input box is empty. Paste a message, upload a screenshot, or click below to load a sample.</span>
          <button
            type="button"
            onClick={() => handleQuickLoad('electricity')}
            className="font-semibold text-[#0F766E] hover:underline cursor-pointer ml-2 shrink-0"
          >
            Load electricity sample
          </button>
        </div>
      )}

      {/* Example Presets - Issue 18 */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-slate-700">
            Select a benchmark sample
          </span>
          <button
            type="button"
            onClick={onOpenTestCases}
            className="ui-link text-xs font-medium text-[#0F766E] hover:text-[#0b544e] flex items-center space-x-1 self-start sm:self-auto"
          >
            <span>View all 10 test cases</span>
            <FileText className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleQuickLoad('scamlens-demo-1')}
            disabled={isLoading}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 transition-colors cursor-pointer flex items-center space-x-1"
          >
            <Eye className="w-3 h-3 text-teal-600" />
            <span>Electricity Cut (5-Step)</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoad('scamlens-demo-2')}
            disabled={isLoading}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Fake Refund (Collect Scam)
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoad('scamlens-demo-3')}
            disabled={isLoading}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Hinglish Urgent KYC
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoad('scamlens-demo-4')}
            disabled={isLoading}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Remote-Access (AnyDesk)
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoad('test-9')}
            disabled={isLoading}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Legitimate Bank Alert
          </button>
        </div>
      </div>

      {/* Main Action Buttons - Issues 8, 17 */}
      <div className="analyzer-actions flex flex-wrap items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onOpenScreenshot}
          disabled={isLoading}
          className="ui-button ui-button-secondary h-10 px-3.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs inline-flex items-center space-x-1.5 cursor-pointer"
          title="Upload screenshot of SMS or chat"
        >
          <Upload className="w-3.5 h-3.5 text-slate-500" />
          <span>Upload Screenshot</span>
        </button>

        <button
          type="button"
          onClick={onOpenUpiTool}
          disabled={isLoading}
          className="ui-button ui-button-secondary h-10 px-3.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs inline-flex items-center space-x-1.5 cursor-pointer"
          title="Inspect UPI intent URI or QR code text"
        >
          <Link2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Inspect UPI Link</span>
        </button>

        {onTryScamLensDemo && (
          <button
            type="button"
            onClick={onTryScamLensDemo}
            disabled={isLoading}
            className="ui-button h-10 px-3.5 text-xs font-semibold text-[#0F766E] bg-teal-50 hover:bg-teal-100 border border-teal-300 transition-colors shadow-2xs inline-flex items-center space-x-1.5 cursor-pointer"
            title="Load the 5-step electricity disconnection scam attack chain demo"
          >
            <Eye className="w-4 h-4 text-teal-700" />
            <span>Try ScamLens</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleRandomExample}
          disabled={isLoading}
          className="ui-button ui-button-secondary h-10 px-4 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
        >
          Try Example
        </button>

        <button
          type="button"
          disabled={!inputText.trim() || isLoading}
          onClick={onAnalyze}
          className={`ui-button ui-button-primary h-10 sm:h-11 px-5 text-sm font-semibold inline-flex items-center space-x-2 ${
            !inputText.trim() || isLoading
              ? 'opacity-50 cursor-not-allowed bg-slate-300 border-slate-300 text-slate-500'
              : ''
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Analyze Message</span>
        </button>
      </div>
    </div>
  );
};
