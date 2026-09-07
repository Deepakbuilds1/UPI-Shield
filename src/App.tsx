import React, { useState, useEffect } from 'react';
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
import { DEMO_MESSAGES } from './data/demoMessages';
import { AnalysisResponse, DemoTestCase } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [inputText, setInputText] = useState<string>(DEMO_MESSAGES[0].text);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [isTestCasesOpen, setIsTestCasesOpen] = useState(false);

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

      // Smooth scroll down to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
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
  };

  const handleScrollToAnalyzer = () => {
    const el = document.getElementById('analyzer-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToEducation = () => {
    const el = document.getElementById('education-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSafetyGuide = () => {
    const el = document.getElementById('safety-guide-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTryDemoScam = () => {
    const scamDemos = DEMO_MESSAGES.filter((m) => m.expectedRisk === 'HIGH' || m.expectedRisk === 'CRITICAL');
    const randomScam = scamDemos[Math.floor(Math.random() * scamDemos.length)];
    setInputText(randomScam.text);
    handleAnalyze(randomScam.text);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1F33] flex flex-col font-sans selection:bg-slate-200">
      {/* Top Navigation */}
      <Header
        onOpenTestCases={() => setIsTestCasesOpen(true)}
        onOpenUpiTool={() => setIsUpiModalOpen(true)}
        onScrollToAnalyzer={handleScrollToAnalyzer}
        onScrollToEducation={handleScrollToEducation}
        onScrollToSafetyGuide={handleScrollToSafetyGuide}
      />

      {/* Hero Section */}
      <HeroSection
        onAnalyzeClick={handleScrollToAnalyzer}
        onTryDemoClick={handleTryDemoScam}
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
        />

        {/* Error Notification */}
        {error && (
          <div className="max-w-[850px] mx-auto p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#B91C1C] flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#B91C1C]" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => handleAnalyze()}
              className="font-semibold underline hover:text-red-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Results Container adhering to Section 18 Recommended Order */}
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
                  onClick={() => handleAnalyze()}
                  disabled={isLoading}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-[#0B1F33] bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Re-analyze</span>
                </button>
              </div>
            </div>

            {/* 1. Risk Status (ThreatMeter - Horizontal Indicator) */}
            <ThreatMeter
              score={analysisResult.risk_score}
              riskLevel={analysisResult.risk_level}
              confidence={analysisResult.confidence}
            />

            {/* 2. Primary Result Card (Scam category & typology) */}
            <ScamCategoryCard
              categories={analysisResult.categories}
              riskLevel={analysisResult.risk_level}
            />

            {/* 3. Detected Signals */}
            <DetectedSignalsList signals={analysisResult.signals} />

            {/* 4. Why this message is risky (Numbered report format) */}
            <WhySuspiciousCard reasons={analysisResult.why_suspicious} />

            {/* 5. Safety Action Card (DO NOT PAY YET for High/Critical) */}
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

      {/* Professional Minimal Footer */}
      <Footer />

      {/* Secondary Modals */}
      <ScreenshotModal
        isOpen={isScreenshotOpen}
        onClose={() => setIsScreenshotOpen(false)}
        onTextExtracted={(extracted) => {
          setInputText(extracted);
          handleAnalyze(extracted);
        }}
      />

      <UpiParserModal
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
        onSendToAnalyzer={(text) => {
          setInputText(text);
          handleAnalyze(text);
        }}
      />

      <TestCasesModal
        isOpen={isTestCasesOpen}
        onClose={() => setIsTestCasesOpen(false)}
        onSelectTestCase={handleSelectTestCase}
      />
    </div>
  );
}
