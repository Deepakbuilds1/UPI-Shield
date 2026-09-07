import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MessageAnalyzer } from './components/MessageAnalyzer';
import { ThreatMeter } from './components/ThreatMeter';
import { SafetyCard } from './components/SafetyCard';
import { BilingualWarningCard } from './components/BilingualWarningCard';
import { ScamCategoryCard } from './components/ScamCategoryCard';
import { DetectedSignalsList } from './components/DetectedSignalsList';
import { WhySuspiciousCard } from './components/WhySuspiciousCard';
import { PaymentRiskCard } from './components/PaymentRiskCard';
import { UPIDetailsCard } from './components/UPIDetailsCard';
import { RecommendedActionsCard } from './components/RecommendedActionsCard';
import { TechnicalAnalysisCard } from './components/TechnicalAnalysisCard';
import { ScreenshotModal } from './components/ScreenshotModal';
import { UpiParserModal } from './components/UpiParserModal';
import { TestCasesModal } from './components/TestCasesModal';
import { EducationSection } from './components/EducationSection';
import { Footer } from './components/Footer';
import { OfflineBanner } from './components/OfflineBanner';
import { ToastContainer } from './components/ToastContainer';
import { ErrorBoundary } from './components/ErrorBoundary';

// Dedicated Sub-Pages
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/pages/TermsOfServicePage';
import { LegalDisclaimerPage } from './components/pages/LegalDisclaimerPage';
import { AcceptableUsePage } from './components/pages/AcceptableUsePage';
import { SecurityPolicyPage } from './components/pages/SecurityPolicyPage';
import { CookiePolicyPage } from './components/pages/CookiePolicyPage';
import { AccessibilityStatementPage } from './components/pages/AccessibilityStatementPage';
import { IncidentHelpCenterPage } from './components/pages/IncidentHelpCenterPage';
import { OnboardingGuidePage } from './components/pages/OnboardingGuidePage';
import { NotFoundPage } from './components/pages/NotFoundPage';

import { DEMO_MESSAGES, HACKATHON_DEMO } from './data/demoMessages';
import { ScamLens } from './components/scamlens';
import { AnalysisResponse, DemoTestCase, AppRoute, ToastMessage } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

function parseRouteFromHash(hash: string): AppRoute {
  const cleanHash = hash.replace(/^#\/?/, '').toLowerCase().trim();
  if (!cleanHash || cleanHash === '' || cleanHash === 'home') return 'home';
  if (cleanHash === 'help' || cleanHash === 'support') return 'help';
  if (cleanHash === 'privacy') return 'privacy';
  if (cleanHash === 'terms') return 'terms';
  if (cleanHash === 'disclaimer') return 'disclaimer';
  if (cleanHash === 'acceptable-use' || cleanHash === 'aup') return 'acceptable-use';
  if (cleanHash === 'security' || cleanHash === 'responsible-disclosure') return 'security';
  if (cleanHash === 'cookies' || cleanHash === 'cookie-policy') return 'cookies';
  if (cleanHash === 'accessibility') return 'accessibility';
  if (cleanHash === 'onboarding' || cleanHash === 'guide') return 'onboarding';
  return 'not-found';
}

export default function App() {
  // Navigation Route State
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() =>
    parseRouteFromHash(window.location.hash)
  );

  // Analysis Workspace State
  const [inputText, setInputText] = useState<string>(DEMO_MESSAGES[0].text);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [isTestCasesOpen, setIsTestCasesOpen] = useState(false);

  // Toast notification state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Hash-based router listener & page title synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = parseRouteFromHash(window.location.hash);
      setCurrentRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync document title with active route
  useEffect(() => {
    const baseTitle = 'UPI-Shield — Payment Scam & Coercion Detector';
    switch (currentRoute) {
      case 'help':
        document.title = `Incident Response & Help Center | ${baseTitle}`;
        break;
      case 'privacy':
        document.title = `Privacy Policy | ${baseTitle}`;
        break;
      case 'terms':
        document.title = `Terms of Service | ${baseTitle}`;
        break;
      case 'disclaimer':
        document.title = `Legal Disclaimer | ${baseTitle}`;
        break;
      case 'acceptable-use':
        document.title = `Acceptable Use Policy | ${baseTitle}`;
        break;
      case 'security':
        document.title = `Security & Responsible Disclosure | ${baseTitle}`;
        break;
      case 'cookies':
        document.title = `Cookie & Storage Policy | ${baseTitle}`;
        break;
      case 'accessibility':
        document.title = `Accessibility Statement | ${baseTitle}`;
        break;
      case 'onboarding':
        document.title = `Quick-Start Guide | ${baseTitle}`;
        break;
      case 'not-found':
        document.title = `Page Not Found (404) | ${baseTitle}`;
        break;
      default:
        document.title = baseTitle;
    }
  }, [currentRoute]);

  const navigateTo = useCallback((route: AppRoute) => {
    if (route === 'home') {
      window.location.hash = '#/';
    } else {
      window.location.hash = `#/${route}`;
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Initial load auto-analyze demo message
  useEffect(() => {
    handleAnalyze();
  }, []);

  const handleAnalyze = async (customText?: string, customLang?: string) => {
    const textToAnalyze = (customText !== undefined ? customText : inputText).trim();
    if (!textToAnalyze) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToAnalyze,
          language: customLang || selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: Failed to analyze message`);
      }

      const data: AnalysisResponse = await response.json();
      setAnalysisResult(data);

      // Smooth scroll down to results if on home view
      if (currentRoute === 'home') {
        setTimeout(() => {
          const resultsEl = document.getElementById('results-section');
          if (resultsEl) {
            resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    } catch (err: any) {
      console.error('Analysis request error:', err);
      setError(err.message || 'Unable to connect to analysis engine. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTestCase = (testCase: DemoTestCase) => {
    setInputText(testCase.text);
    handleAnalyze(testCase.text);
    if (currentRoute !== 'home') {
      navigateTo('home');
    }
    addToast(`Loaded test vector: "${testCase.title}"`, 'info');
  };

  const handleScrollToAnalyzer = () => {
    if (currentRoute !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        const el = document.getElementById('analyzer-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('analyzer-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToEducation = () => {
    if (currentRoute !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        const el = document.getElementById('education-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('education-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSafetyGuide = () => {
    if (currentRoute !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        const el = document.getElementById('safety-guide-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('safety-guide-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTryDemoScam = () => {
    if (currentRoute !== 'home') {
      navigateTo('home');
    }
    const scamDemos = DEMO_MESSAGES.filter((m) => m.expectedRisk === 'HIGH' || m.expectedRisk === 'CRITICAL');
    const randomScam = scamDemos[Math.floor(Math.random() * scamDemos.length)];
    setInputText(randomScam.text);
    handleAnalyze(randomScam.text);
    addToast(`Loaded demo: ${randomScam.title}`, 'info');
  };

  const handleTryScamLens = () => {
    if (currentRoute !== 'home') {
      navigateTo('home');
    }
    setInputText(HACKATHON_DEMO.text);
    handleAnalyze(HACKATHON_DEMO.text);
    addToast('Loaded ScamLens demo: 5-step electricity disconnection attack', 'info');
    setTimeout(() => {
      const el = document.getElementById('scamlens-section') || document.getElementById('results-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0B1F33] flex flex-col font-sans selection:bg-slate-200">
        {/* Offline Detection Banner */}
        <OfflineBanner />

        {/* Top Navigation */}
        <Header
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          onOpenTestCases={() => setIsTestCasesOpen(true)}
          onOpenUpiTool={() => setIsUpiModalOpen(true)}
          onScrollToAnalyzer={handleScrollToAnalyzer}
          onScrollToEducation={handleScrollToEducation}
          onScrollToSafetyGuide={handleScrollToSafetyGuide}
        />

        {/* Dynamic Route View Rendering */}
        {currentRoute === 'privacy' && (
          <main className="flex-1">
            <PrivacyPolicyPage onNavigateHome={() => navigateTo('home')} />
          </main>
        )}

        {currentRoute === 'terms' && (
          <main className="flex-1">
            <TermsOfServicePage onNavigateHome={() => navigateTo('home')} />
          </main>
        )}

        {currentRoute === 'disclaimer' && (
          <main className="flex-1">
            <LegalDisclaimerPage
              onNavigateHome={() => navigateTo('home')}
              onNavigateHelp={() => navigateTo('help')}
            />
          </main>
        )}

        {currentRoute === 'acceptable-use' && (
          <main className="flex-1">
            <AcceptableUsePage onNavigateHome={() => navigateTo('home')} />
          </main>
        )}

        {currentRoute === 'security' && (
          <main className="flex-1">
            <SecurityPolicyPage onNavigateHome={() => navigateTo('home')} />
          </main>
        )}

        {currentRoute === 'cookies' && (
          <main className="flex-1">
            <CookiePolicyPage onNavigateHome={() => navigateTo('home')} />
          </main>
        )}

        {currentRoute === 'accessibility' && (
          <main className="flex-1">
            <AccessibilityStatementPage onNavigateHome={() => navigateTo('home')} />
          </main>
        )}

        {currentRoute === 'help' && (
          <main className="flex-1">
            <IncidentHelpCenterPage onNavigateHome={() => navigateTo('home')} />
          </main>
        )}

        {currentRoute === 'onboarding' && (
          <main className="flex-1">
            <OnboardingGuidePage onNavigateHome={() => navigateTo('home')} />
          </main>
        )}

        {currentRoute === 'not-found' && (
          <main className="flex-1">
            <NotFoundPage
              onNavigateHome={() => navigateTo('home')}
              onNavigateHelp={() => navigateTo('help')}
            />
          </main>
        )}

        {/* Primary Home Workspace */}
        {currentRoute === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection
              onAnalyzeClick={handleScrollToAnalyzer}
              onTryDemoClick={handleTryDemoScam}
              onTryScamLensClick={handleTryScamLens}
            />

            {/* Main Workspace */}
            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8 flex-1">
              {/* Input Card */}
              <MessageAnalyzer
                inputText={inputText}
                setInputText={setInputText}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                isLoading={isLoading}
                onAnalyze={() => handleAnalyze()}
                onOpenScreenshot={() => setIsScreenshotOpen(true)}
                onOpenUpiTool={() => setIsUpiModalOpen(true)}
                onOpenTestCases={() => setIsTestCasesOpen(true)}
                onTryScamLensDemo={handleTryScamLens}
              />

              {/* Error Notification with Enhanced Actionable Recovery */}
              {error && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="max-w-[850px] mx-auto p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#B91C1C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm"
                >
                  <div className="flex items-start sm:items-center space-x-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#B91C1C] mt-0.5 sm:mt-0" />
                    <div>
                      <span className="font-semibold block sm:inline mr-1">Analysis Notice:</span>
                      <span>{error}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleAnalyze()}
                      className="px-3 py-1 rounded bg-[#B91C1C] text-white font-semibold hover:bg-red-800 transition-colors cursor-pointer"
                    >
                      Retry Analysis
                    </button>
                  </div>
                </div>
              )}

              {/* Results Container adhering to Recommended Order */}
              {analysisResult && (
                <section id="results-section" className="max-w-[850px] mx-auto space-y-6 pt-2">
                  {/* Results Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[12px] font-semibold uppercase tracking-wider text-slate-500 block">
                        Verification Report
                      </span>
                      <h2 className="text-xl font-bold text-[#0B1F33] tracking-tight">
                        Contextual Risk Assessment
                      </h2>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                      <span className="text-slate-500">
                        Language: <strong className="text-slate-800 font-semibold">{analysisResult.language}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          handleAnalyze();
                          addToast('Re-analyzing message...', 'info');
                        }}
                        disabled={isLoading}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0B1F33] bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Re-analyze</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. Risk Status (ThreatMeter) */}
                  <ThreatMeter
                    score={analysisResult.risk_score}
                    riskLevel={analysisResult.risk_level}
                    confidence={analysisResult.confidence}
                  />

                  {/* 2. ScamLens: Signature Social-Engineering Attack Chain & Manipulation Analysis */}
                  {analysisResult.scam_lens && (
                    <ScamLens
                      data={analysisResult.scam_lens}
                      originalText={inputText}
                      riskLevel={analysisResult.risk_level}
                      riskScore={analysisResult.risk_score}
                      detectedLanguage={analysisResult.language}
                    />
                  )}

                  {/* 3. Primary Result Card */}
                  <ScamCategoryCard
                    categories={analysisResult.categories}
                    riskLevel={analysisResult.risk_level}
                  />

                  {/* 3. Detected Signals */}
                  <DetectedSignalsList signals={analysisResult.signals} />

                  {/* 4. Why this message is risky */}
                  <WhySuspiciousCard reasons={analysisResult.why_suspicious} />

                  {/* 5. Safety Action Card */}
                  <SafetyCard riskLevel={analysisResult.risk_level} />

                  {/* 6. English + Hindi Warning Toggle */}
                  <BilingualWarningCard
                    englishWarning={analysisResult.warnings.english}
                    hindiWarning={analysisResult.warnings.hindi}
                  />

                  {/* 7. Extracted Payment Risk & Coordinates */}
                  <PaymentRiskCard payment={analysisResult.payment} />

                  {/* 8. UPI Intent Parameter Breakdown (if present) */}
                  <UPIDetailsCard upi={analysisResult.upi_intent} />

                  {/* 9. Recommended Protective Actions */}
                  <RecommendedActionsCard recommendations={analysisResult.recommendations} />

                  {/* 10. Technical Risk Weights */}
                  <TechnicalAnalysisCard
                    technical={analysisResult.technical_analysis}
                    signalBreakdown={analysisResult.signal_breakdown}
                    riskScore={analysisResult.risk_score}
                  />
                </section>
              )}
            </main>

            {/* Educational Pre-Authorization Gap Section & Safety Guide */}
            <EducationSection />
          </>
        )}

        {/* Global Footer */}
        <Footer
          onNavigate={navigateTo}
          onScrollToEducation={handleScrollToEducation}
          onScrollToSafetyGuide={handleScrollToSafetyGuide}
        />

        {/* Secondary Modals */}
        <ScreenshotModal
          isOpen={isScreenshotOpen}
          onClose={() => setIsScreenshotOpen(false)}
          onTextExtracted={(extracted) => {
            setInputText(extracted);
            handleAnalyze(extracted);
            addToast('Screenshot text extracted successfully!', 'success');
          }}
        />

        <UpiParserModal
          isOpen={isUpiModalOpen}
          onClose={() => setIsUpiModalOpen(false)}
          onSendToAnalyzer={(text) => {
            setInputText(text);
            handleAnalyze(text);
            addToast('UPI parameters transferred to analyzer', 'success');
          }}
        />

        <TestCasesModal
          isOpen={isTestCasesOpen}
          onClose={() => setIsTestCasesOpen(false)}
          onSelectTestCase={handleSelectTestCase}
        />

        {/* Accessible Toast Notifications */}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    </ErrorBoundary>
  );
}
