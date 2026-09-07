import React, { useState } from 'react';
import { X, Search, Info, Check } from 'lucide-react';
import { UpiIntentDetails } from '../types';

interface UpiParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToAnalyzer: (text: string) => void;
}

export const UpiParserModal: React.FC<UpiParserModalProps> = ({
  isOpen,
  onClose,
  onSendToAnalyzer,
}) => {
  const [inputUri, setInputUri] = useState(
    'upi://pay?pa=power-discom-verify@oksbi&pn=DiscomBillingDesk&am=2&cu=INR&tn=Electricity+Bill+Verification'
  );
  const [parsed, setParsed] = useState<UpiIntentDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!inputUri.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/parse-upi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri: inputUri.trim() }),
      });

      if (!res.ok) {
        throw new Error('Failed to parse UPI string.');
      }

      const data = await res.json();
      setParsed(data);
    } catch (err: any) {
      setError('Unable to parse valid UPI parameters. Please check string format.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (parsed) {
      const summaryText = `Suspicious UPI Intent request received: Payee VPA: ${parsed.pa || 'N/A'}, Name: ${parsed.pn || 'N/A'}, Amount: ₹${parsed.am || 'N/A'}, Note: ${parsed.tn || 'N/A'}. Raw URI: ${parsed.raw_uri || inputUri}`;
      onSendToAnalyzer(summaryText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-xl p-6 space-y-4 max-h-[90vh] flex flex-col text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#0B1F33]">
              Inspect UPI Link / QR Payload
            </h3>
            <p className="text-xs text-slate-500">
              Decode and inspect upi://pay parameters for scam indicators
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#0B1F33] block">
            Enter UPI Intent URI or Scanned QR String:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputUri}
              onChange={(e) => setInputUri(e.target.value)}
              placeholder="upi://pay?pa=merchant@upi&pn=Name&am=100..."
              className="flex-1 p-2.5 rounded-lg border border-slate-300 focus:border-[#0F766E] text-xs font-mono text-[#0B1F33] outline-hidden"
            />
            <button
              type="button"
              onClick={handleParse}
              disabled={isLoading || !inputUri.trim()}
              className="h-10 px-4 rounded-lg text-xs font-semibold text-white bg-[#0B1F33] hover:bg-slate-800 disabled:bg-slate-300 transition-colors cursor-pointer"
            >
              Decode
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-[#B91C1C] p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5]">
            {error}
          </p>
        )}

        {/* Parsed output */}
        {parsed && (
          <div className="space-y-3 overflow-y-auto max-h-60 pt-2">
            <span className="text-xs font-semibold text-[#0B1F33] block">
              Decoded Parameters:
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-medium">Payee VPA (pa)</span>
                <span className="font-mono font-semibold text-[#0B1F33] truncate block mt-0.5">
                  {parsed.pa || 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-medium">Payee Name (pn)</span>
                <span className="font-semibold text-[#0B1F33] truncate block mt-0.5">
                  {parsed.pn || 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-medium">Amount (am)</span>
                <span className="font-mono font-semibold text-[#0B1F33] block mt-0.5">
                  {parsed.am ? `₹${parsed.am}` : 'User-defined'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-medium">Note (tn)</span>
                <span className="text-slate-700 truncate block mt-0.5">
                  {parsed.tn || 'None'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-800 block">
                Destination could not be independently verified.
              </span>
              <p>{parsed.safety_advisory}</p>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            disabled={!parsed}
            onClick={handleSend}
            className={`h-10 px-4 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer ${
              !parsed ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#0F766E] hover:bg-[#0d655e]'
            }`}
          >
            Send to Threat Analyzer
          </button>
        </div>
      </div>
    </div>
  );
};
