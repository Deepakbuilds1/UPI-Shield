import React from 'react';
import { Eye, ArrowLeft, CheckCircle2, Sliders, Volume2, Keyboard } from 'lucide-react';

interface PageProps {
  onNavigateHome: () => void;
}

export const AccessibilityStatementPage: React.FC<PageProps> = ({ onNavigateHome }) => {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 space-y-8 text-left font-sans">
      <button
        type="button"
        onClick={onNavigateHome}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-[#0B1F33] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Threat Analyzer</span>
      </button>

      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
          <Eye className="w-4 h-4" />
          <span>Universal Design & Accessibility</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight">
          Accessibility Statement
        </h1>
        <p className="text-xs text-slate-500">
          Our commitment to digital inclusion, WCAG 2.1 AA alignment, and assistive technology support
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Keyboard className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900">Keyboard Navigation</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            All interactive buttons, modals, and text inputs are fully operable via Tab, Enter, Space, and Escape keys with visible focus outlines.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900">Screen Reader Support</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dynamic analysis results and loading states utilize <code>aria-live="polite"</code> regions to announce threat scores to screen readers.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900">High Contrast Ratios</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Text elements adhere strictly to WCAG AA contrast standards (minimum 4.5:1 for body copy against light backgrounds).
          </p>
        </div>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">1. Accessibility Features Implemented</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Non-color reliant indicators:</strong> Risk levels (SAFE, LOW, MEDIUM, HIGH, CRITICAL) are indicated with explicit text labels, icons, and numerical scores, not color alone.</li>
            <li><strong>Reduced motion compatibility:</strong> Essential UI transitions respect user operating system preferences for reduced animations.</li>
            <li><strong>Touch targets:</strong> Interactive buttons maintain a minimum 44px hit-target for touchscreens.</li>
            <li><strong>Semantic HTML:</strong> Proper heading hierarchy (H1, H2, H3), semantic landmarks (<code>header</code>, <code>main</code>, <code>section</code>, <code>footer</code>), and descriptive button labels.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">2. Known Limitations & Ongoing Enhancements</h2>
          <p>
            While we strive for comprehensive accessibility, screenshots uploaded by users may contain low-contrast or illegible text from external apps. In such situations, the user can manually edit or paste the extracted text into the primary text area.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B1F33]">3. Feedback & Contact</h2>
          <p>
            If you encounter an accessibility barrier or require assistance using assistive technology with UPI-Shield, please contact us at <code>accessibility@upi-shield.local</code>. We prioritize remediation of all reported accessibility defects.
          </p>
        </section>
      </div>
    </div>
  );
};
