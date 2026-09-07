import React from 'react';
import { ShieldAlert, PauseCircle, CheckCircle2 } from 'lucide-react';

interface PausePointProps {
  pausePoint: string;
}

export const PausePoint: React.FC<PausePointProps> = ({ pausePoint }) => {
  if (!pausePoint) return null;

  return (
    <div
      id="safest-pause-point-card"
      className="rounded-xl border border-teal-300 bg-teal-50/70 p-4 sm:p-5 shadow-2xs transition-colors"
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-teal-600 text-white shrink-0 mt-0.5 shadow-xs">
          <PauseCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
              Actionable Defense
            </span>
            <h4 className="text-sm sm:text-base font-bold text-[#0B1F33]">
              Your safest pause point
            </h4>
          </div>
          <p className="text-sm font-semibold text-teal-950 leading-relaxed">
            {pausePoint}
          </p>
          <div className="flex items-center space-x-1 text-xs text-teal-800 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Pausing at this step breaks the social-engineering chain and prevents unauthorized asset transfer.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
