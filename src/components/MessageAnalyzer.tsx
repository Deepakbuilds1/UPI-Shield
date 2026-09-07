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
} from 'lucide-react';
import { DEMO_MESSAGES } from '../data/demoMessages';

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
}) => {
  const [activeSource, setActiveSource] = useState<'SMS' | 'WhatsApp' | 'Email' | 'Payment Note' | 'UPI Request'>('SMS');

  const sources = ['SMS', 'WhatsApp', 'Email', 'Payment Note', 'UPI Request'] as const;

  const handleQuickLoad = (id: string) => {
    const found = DEMO_MESSAGES.find((m) => m.id === id);
    if (found) {
      setInputText(found.text);
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

        {/* Source selector */}
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <span className="text-xs font-medium text-slate-500 mr-1 hidden sm:inline">Source:</span>
          {sources.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveSource(src)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                activeSource === src
                  ? 'bg-[#0B1F33] text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
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

      {/* Loading Progress State (Disciplined & Professional) */}
      {isLoading && (
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center space-x-2 text-sm font-semibold text-[#0B1F33]">
            <Loader2 className="w-4 h-4 animate-spin text-[#0F766E]" />
            <span>Analyzing message...</span>
          </div>
          <div className="text-xs text-slate-600 space-y-1 pl-6">
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Checking message context</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Checking social-engineering signals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Checking payment indicators</span>
            </div>
          </div>
        </div>
      )}

      {/* Example Presets */}
      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-700">
            Select a benchmark sample:
          </span>
          <button
            type="button"
            onClick={onOpenTestCases}
            className="text-xs font-medium text-[#0F766E] hover:text-[#0b544e] transition-colors cursor-pointer flex items-center space-x-1"
          >
            <span>View all 10 test cases</span>
            <FileText className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickLoad('electricity')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Electricity Disconnection
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoad('refund')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            ₹1 Verification Trap
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoad('hinglish-kyc')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Hinglish Urgent KYC
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoad('remote-access')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Screen-Sharing Scam
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoad('legitimate')}
            disabled={isLoading}
            className="px-2.5 py-1 rounded text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Legitimate Bank Alert
          </button>
        </div>
      </div>

      {/* Main Buttons and Secondary Tools */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Secondary Tools */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onOpenScreenshot}
            disabled={isLoading}
            className="inline-flex items-center space-x-1.5 px-3.5 h-10 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
            title="Upload screenshot of SMS or chat"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload Screenshot</span>
          </button>

          <button
            type="button"
            onClick={onOpenUpiTool}
            disabled={isLoading}
            className="inline-flex items-center space-x-1.5 px-3.5 h-10 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
            title="Inspect UPI intent URI or QR code text"
          >
            <Link2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Inspect UPI Link</span>
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={handleRandomExample}
            disabled={isLoading}
            className="px-4 h-11 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
          >
            Try Example
          </button>

          <button
            type="button"
            disabled={!inputText.trim() || isLoading}
            onClick={onAnalyze}
            className={`px-5 h-11 rounded-lg text-sm font-semibold text-white transition-colors inline-flex items-center justify-center space-x-2 cursor-pointer ${
              !inputText.trim() || isLoading
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-[#0F766E] hover:bg-[#0d655e] active:bg-[#0b544e]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Analyze Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};
