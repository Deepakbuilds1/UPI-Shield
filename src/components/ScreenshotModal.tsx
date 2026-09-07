import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Loader2, Check } from 'lucide-react';

interface ScreenshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTextExtracted: (text: string) => void;
}

export const ScreenshotModal: React.FC<ScreenshotModalProps> = ({
  isOpen,
  onClose,
  onTextExtracted,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      setError('Please upload an image file (PNG, JPG, JPEG, or WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Image file is too large. Please upload an image under 8MB.');
      return;
    }

    setError(null);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImagePreview(base64);
      processOCR(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const processOCR = async (base64: string, type: string) => {
    setIsLoading(true);
    setError(null);
    setExtractedText(null);

    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType: type }),
      });

      if (!res.ok) {
        throw new Error('OCR text extraction failed. Please ensure the image is clear.');
      }

      const data = await res.json();
      if (data.text) {
        setExtractedText(data.text);
      } else {
        throw new Error('No legible text found in screenshot.');
      }
    } catch (err: any) {
      setError(err.message || 'Error processing image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (extractedText) {
      onTextExtracted(extractedText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-xl p-6 space-y-4 max-h-[90vh] flex flex-col text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#0B1F33]">
              Analyze Screenshot
            </h3>
            <p className="text-xs text-slate-500">
              Upload a screenshot of a suspicious message
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

        {/* Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) {
              handleFileChange(e.dataTransfer.files[0]);
            }
          }}
          className="border border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 bg-[#F8FAFC] transition-colors cursor-pointer space-y-2"
        >
          <Upload className="w-6 h-6 text-slate-400 mx-auto" />
          <div>
            <span className="text-xs font-semibold text-[#0B1F33] block">
              Click to browse or drag & drop screenshot
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Supports PNG, JPG, or WEBP (Max 8MB)
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
            }}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#B91C1C] flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Processing Indicator */}
        {isLoading && (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center space-y-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#0F766E] mx-auto" />
            <p className="text-xs font-medium text-slate-700">Extracting text from screenshot...</p>
          </div>
        )}

        {/* Extracted preview */}
        {extractedText && !isLoading && (
          <div className="space-y-2 overflow-y-auto max-h-48">
            <span className="text-xs font-semibold text-[#0B1F33] block">
              Extracted Message Text:
            </span>
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs text-slate-800 font-mono leading-relaxed max-h-36 overflow-y-auto">
              {extractedText}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!extractedText || isLoading}
            onClick={handleApply}
            className={`h-10 px-4 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer ${
              !extractedText || isLoading
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-[#0F766E] hover:bg-[#0d655e]'
            }`}
          >
            Use Extracted Text
          </button>
        </div>
      </div>
    </div>
  );
};
