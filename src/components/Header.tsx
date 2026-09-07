import React, { useState } from 'react';
import { ShieldCheck, Menu, X, FileText, LifeBuoy, Sparkles } from 'lucide-react';
import { AppRoute } from '../types';

interface HeaderProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenTestCases: () => void;
  onOpenUpiTool: () => void;
  onScrollToAnalyzer: () => void;
  onScrollToEducation?: () => void;
  onScrollToSafetyGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenTestCases,
  onOpenUpiTool,
  onScrollToAnalyzer,
  onScrollToEducation,
  onScrollToSafetyGuide,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (callback?: () => void) => {
    setMobileMenuOpen(false);
    if (currentRoute !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        if (callback) callback();
      }, 100);
    } else {
      if (callback) callback();
    }
  };

  const handleRouteClick = (route: AppRoute) => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          type="button"
          onClick={() => handleRouteClick('home')}
          className="flex items-center space-x-3 text-left cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#0B1F33] text-white flex items-center justify-center transition-colors group-hover:bg-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-[#0B1F33]">
                UPI-Shield
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded">
                Payment Security
              </span>
            </div>
          </div>
        </button>

        {/* Center Navigation - Issue 15: Clean text-only navigation */}
        <nav
          className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600"
          aria-label="Main navigation"
        >
          <button
            type="button"
            onClick={() => handleRouteClick('home')}
            className={`transition-colors cursor-pointer ${
              currentRoute === 'home' ? 'text-[#0B1F33] font-semibold' : 'hover:text-[#0F766E]'
            }`}
          >
            Threat Analyzer
          </button>
          <button
            type="button"
            onClick={() => handleNavClick(onScrollToEducation)}
            className="hover:text-[#0F766E] transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => handleNavClick(onScrollToSafetyGuide)}
            className="hover:text-[#0F766E] transition-colors cursor-pointer"
          >
            Safety Guide
          </button>
          <button
            type="button"
            onClick={() => handleRouteClick('help')}
            className={`transition-colors cursor-pointer ${
              currentRoute === 'help' ? 'text-[#0B1F33] font-semibold' : 'hover:text-[#0F766E]'
            }`}
          >
            Incident Help
          </button>
          <button
            type="button"
            onClick={() => {
              handleNavClick();
              onOpenTestCases();
            }}
            className="hover:text-[#0F766E] transition-colors cursor-pointer"
          >
            Test Cases
          </button>
        </nav>

        {/* Action Button & Mobile Toggle - Issue 13 & 14 */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleNavClick(onScrollToAnalyzer)}
            aria-label="Go to message analyzer"
            className="ui-button ui-button-secondary px-4 h-10 border border-slate-300 bg-white text-[#0B1F33] hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer text-sm font-semibold"
          >
            Analyze Message
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 text-sm font-medium text-slate-700">
          <button
            type="button"
            onClick={() => handleRouteClick('home')}
            className={`block w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer ${
              currentRoute === 'home' ? 'bg-slate-100 font-bold' : ''
            }`}
          >
            Threat Analyzer
          </button>
          <button
            type="button"
            onClick={() => handleRouteClick('onboarding')}
            className={`block w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between ${
              currentRoute === 'onboarding' ? 'bg-slate-100 font-bold' : ''
            }`}
          >
            <span>Quick-Start Guide</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </button>
          <button
            type="button"
            onClick={() => handleRouteClick('help')}
            className={`block w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between text-red-700 ${
              currentRoute === 'help' ? 'bg-red-50 font-bold' : ''
            }`}
          >
            <span>Emergency Incident Help</span>
            <LifeBuoy className="w-4 h-4 text-red-600" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick(onScrollToEducation)}
            className="block w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => handleNavClick(onScrollToSafetyGuide)}
            className="block w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            Safety Guide
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTestCases();
            }}
            className="block w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between"
          >
            <span>10 Benchmark Test Cases</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenUpiTool();
            }}
            className="block w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            UPI Intent Inspector
          </button>
        </div>
      )}
    </header>
  );
};
