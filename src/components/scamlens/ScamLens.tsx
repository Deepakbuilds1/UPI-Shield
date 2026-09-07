import React from 'react';
import { ScamLensData, RiskLevel } from '../../types';
import { ManipulationScore } from './ManipulationScore';
import { AttackChain } from './AttackChain';
import { EvidenceHighlight } from './EvidenceHighlight';
import { PausePoint } from './PausePoint';
import { LikelyObjective } from './LikelyObjective';
import { BilingualScamLens } from './BilingualScamLens';
import { ScamLensComparison } from './ScamLensComparison';
import { Eye, ShieldAlert, Sparkles } from 'lucide-react';

interface ScamLensProps {
  data?: ScamLensData | null;
  originalText: string;
  riskLevel: RiskLevel;
  riskScore: number;
  detectedLanguage?: string;
}

export const ScamLens: React.FC<ScamLensProps> = ({
  data,
  originalText,
  riskLevel,
  riskScore,
  detectedLanguage = 'English',
}) => {
  // Graceful fallback if data is unavailable
  if (!data) {
    return (
      <div
        id="scamlens-fallback-card"
        className="rounded-xl border border-slate-200 bg-white p-5 text-center text-slate-500 text-xs shadow-2xs"
      >
        <p className="font-medium text-slate-700">
          Detailed manipulation analysis is currently unavailable.
        </p>
        <p className="mt-1 text-slate-400">
          The basic risk signals and payment heuristic metrics remain active above.
        </p>
      </div>
    );
  }

  const hasAttackChain = data.attack_chain && data.attack_chain.length > 0;

  return (
    <section
      id="scamlens-section"
      className="rounded-2xl border-2 border-teal-600/30 bg-[#FAFDFD] p-5 sm:p-7 shadow-xs space-y-6"
      aria-label="ScamLens: Social-Engineering Attack Chain Analysis"
    >
      {/* 1. ScamLens Header & Signature Brand Statement */}
      <div className="border-b border-teal-100 pb-5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-teal-600 text-white shadow-xs">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 font-mono">
                  SIGNATURE FEATURE
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-teal-400" />
                <span className="text-[11px] font-semibold text-slate-500">
                  Social-Engineering Chain
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#0B1F33] tracking-tight">
                ScamLens
              </h3>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full flex items-center space-x-1.5 text-xs text-teal-900 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>&ldquo;See how the scam works before you pay.&rdquo;</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm sm:text-base font-bold text-slate-800">
            How this message is trying to manipulate you
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            Scammers often combine several psychological tactics to make victims act before they verify a request.
          </p>
        </div>

        {/* Highlighted Key Product Philosophy Banner */}
        <div className="mt-2 p-2.5 rounded-lg bg-white border border-teal-200/80 flex items-center space-x-2 text-xs text-slate-700">
          <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
          <p className="font-medium text-[#0B1F33]">
            <strong>UPI-Shield</strong> doesn&apos;t just detect suspicious messages. It explains the manipulation behind them.
          </p>
        </div>
      </div>

      {/* 2. Manipulation Risk Score Card */}
      <ManipulationScore
        score={data.manipulation_score}
        paymentRiskScore={riskScore}
      />

      {/* 3. Attack Chain Visualization & Stage Inspector */}
      <AttackChain
        stages={data.attack_chain}
        statusSummary={data.status_summary}
      />

      {/* 4. Actionable Safest Pause Point & Likely Objective */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PausePoint pausePoint={data.safest_pause_point} />
        <LikelyObjective objective={data.likely_objective} />
      </div>

      {/* 5. What the Sender is Doing (Original Message Highlights) */}
      <EvidenceHighlight
        originalText={originalText}
        highlights={data.highlights}
      />

      {/* 6. Bilingual Manipulation Guidance (Hindi & English) */}
      <BilingualScamLens
        englishExplanation={
          hasAttackChain
            ? `This message executes a ${data.attack_chain.length}-stage manipulation sequence (${data.attack_chain
                .map((s) => s.stage_label || s.stage)
                .join(' → ')}). The sender creates artificial panic to prevent you from double-checking official sources.`
            : 'No psychological coercion was observed in this message.'
        }
        hindiExplanation={data.hindi_explanation}
        detectedLanguage={detectedLanguage}
      />

      {/* 7. Before & After ScamLens Educational Comparison */}
      <ScamLensComparison />
    </section>
  );
};
