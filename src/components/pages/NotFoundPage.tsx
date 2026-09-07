import React from 'react';
import { SearchX, Home, LifeBuoy, ArrowLeft } from 'lucide-react';

interface PageProps {
  onNavigateHome: () => void;
  onNavigateHelp: () => void;
}

export const NotFoundPage: React.FC<PageProps> = ({ onNavigateHome, onNavigateHelp }) => {
  return (
    <div className="max-w-[600px] mx-auto px-4 py-16 text-center space-y-6 font-sans">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center mx-auto shadow-2xs">
        <SearchX className="w-8 h-8 text-slate-600" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Error 404 • Destination Not Found
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight">
          Page or Verification State Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The security view or URL path you requested does not exist or may have moved. Use the quick actions below to return safely to the active scanner.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onNavigateHome}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-[#0B1F33] hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Threat Analyzer</span>
        </button>

        <button
          type="button"
          onClick={onNavigateHelp}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
        >
          <LifeBuoy className="w-4 h-4 text-emerald-600" />
          <span>Incident Help Center</span>
        </button>
      </div>
    </div>
  );
};
