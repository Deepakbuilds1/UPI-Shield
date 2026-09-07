import React, { useState } from 'react';
import { AttackStage as AttackStageType } from '../../types';
import { AttackStage, getStageMeta } from './AttackStage';
import { ArrowRight, ArrowDown, ShieldCheck, HelpCircle } from 'lucide-react';

interface AttackChainProps {
  stages: AttackStageType[];
  statusSummary?: string;
}

export const AttackChain: React.FC<AttackChainProps> = ({
  stages,
  statusSummary,
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);

  if (!stages || stages.length === 0) {
    return (
      <div
        id="attack-chain-empty"
        className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 text-center space-y-2"
      >
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-emerald-950">
          No Coercive Manipulation Attack Chain Detected
        </h4>
        <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
          The linguistic analysis did not detect high-pressure psychological manipulation, artificial deadlines, or credential theft patterns in this message.
        </p>
      </div>
    );
  }

  const activeStage = stages[selectedStageIndex] || stages[0];
  const activeMeta = getStageMeta(activeStage.stage);
  const ActiveIcon = activeMeta.icon;

  return (
    <div id="attack-chain-container" className="space-y-4">
      {/* Chain Header Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
            {stages.length} Stages
          </span>
          <span className="text-xs font-semibold text-slate-700">
            {statusSummary || `UPI-Shield detected a ${stages.length}-step social-engineering attack.`}
          </span>
        </div>
        <span className="text-xs text-slate-500 italic">
          Click any stage card below to inspect evidence
        </span>
      </div>

      {/* Responsive Visual Attack Chain */}
      {/* Desktop / Tablet: Horizontal flex flow with right arrows */}
      {/* Mobile: Vertical column with downward arrows */}
      <div className="hidden sm:flex items-center gap-1.5 flex-wrap lg:flex-nowrap">
        {stages.map((stage, idx) => (
          <React.Fragment key={`stage-desktop-${stage.stage}-${idx}`}>
            <AttackStage
              stage={stage}
              index={idx}
              isSelected={selectedStageIndex === idx}
              onSelect={() => setSelectedStageIndex(idx)}
              isLast={idx === stages.length - 1}
            />
            {idx < stages.length - 1 && (
              <div className="shrink-0 flex items-center justify-center px-1 text-slate-400">
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile Vertical Flow */}
      <div className="flex sm:hidden flex-col gap-2">
        {stages.map((stage, idx) => (
          <React.Fragment key={`stage-mobile-${stage.stage}-${idx}`}>
            <AttackStage
              stage={stage}
              index={idx}
              isSelected={selectedStageIndex === idx}
              onSelect={() => setSelectedStageIndex(idx)}
              isLast={idx === stages.length - 1}
            />
            {idx < stages.length - 1 && (
              <div className="flex items-center justify-center py-0.5 text-slate-400">
                <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Selected Stage Detail Inspector */}
      {activeStage && (
        <div
          id="stage-detail-inspector"
          className={`rounded-xl border ${activeMeta.border} ${activeMeta.bg} p-4 sm:p-5 transition-all`}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center space-x-2.5">
              <div className={`p-2 rounded-lg bg-white border ${activeMeta.border} ${activeMeta.color}`}>
                <ActiveIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">
                  Stage {selectedStageIndex + 1} of {stages.length} Inspector
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[#0B1F33]">
                  {activeStage.stage_label || activeMeta.title}
                </h4>
              </div>
            </div>

            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
              Confidence: {Math.round(activeStage.confidence * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-white/90 rounded-lg p-3 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                Evidence extracted from message
              </span>
              <p className="font-mono text-slate-800 bg-slate-50 p-2 rounded border border-slate-200/60 break-words">
                &ldquo;{activeStage.evidence || 'Pattern identified in phrasing'}&rdquo;
              </p>
              <p className="mt-2 text-slate-600 leading-relaxed">
                {activeStage.explanation}
              </p>
            </div>

            <div className="bg-white/90 rounded-lg p-3 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1.5 text-slate-700 font-bold mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-500">
                    Why it matters
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {activeStage.why_it_matters ||
                    'This tactic exploits cognitive biases to pressure victims into bypassing standard security verification.'}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Tactical Severity:</span>
                <span className="font-bold text-slate-800">{activeStage.severity}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
