import React from 'react';
import { RuneType } from '../types/game';
import { RUNES } from '../data/gameData';
import { RuneIcon } from './RuneIcon';
import { formatNumber } from '../utils/calculator';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface RuneSummaryBadgeProps {
  rune: RuneType;
  grossRequired: number;
  owned: number;
  deficit: number;
  surplus: number;
  progress: number;
  onClick?: () => void;
}

export const RuneSummaryBadge: React.FC<RuneSummaryBadgeProps> = ({
  rune,
  grossRequired,
  owned,
  deficit,
  surplus,
  progress,
  onClick,
}) => {
  const meta = RUNES[rune];
  const isNeeded = grossRequired > 0;
  const isFulfilled = isNeeded && deficit === 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative text-left transition-all duration-150 rounded-xl p-2.5 border-2 shadow-pixel flex flex-col justify-between active:translate-y-0.5 ${
        isNeeded
          ? `${meta.bgClass} ${meta.borderClass} hover:border-slate-300`
          : 'bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-90'
      }`}
    >
      {/* Top Header: Pixel Icon, Name & Status Badge */}
      <div className="flex items-center justify-between w-full mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <RuneIcon type={rune} size="sm" glow={isNeeded} />
          <span className={`font-pixel text-[9px] uppercase tracking-wider truncate ${meta.textClass}`}>
            {rune}
          </span>
        </div>

        {isNeeded && (
          <div>
            {isFulfilled ? (
              <span className="font-pixel text-[7px] text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/50 flex items-center gap-0.5 font-bold">
                <CheckCircle2 className="w-2.5 h-2.5" /> OK
              </span>
            ) : (
              <span className="font-pixel text-[7px] text-rose-300 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-500/40 flex items-center gap-0.5 font-bold">
                <AlertCircle className="w-2.5 h-2.5" /> -{formatNumber(deficit)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Numbers: Required vs Stashed */}
      <div className="grid grid-cols-2 gap-1 text-xs py-1 border-t border-slate-800/80 w-full font-mono">
        <div>
          <div className="text-[9px] uppercase text-slate-400">Need</div>
          <div className="font-bold text-white text-xs sm:text-sm">
            {formatNumber(grossRequired)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] uppercase text-slate-400">Stash</div>
          <div className="font-medium text-slate-300 text-xs sm:text-sm">
            {formatNumber(owned)}
          </div>
        </div>
      </div>

      {/* Bottom Deficit Banner & Progress Bar */}
      <div className="mt-1.5 w-full">
        <div className="flex items-center justify-between text-[10px] mb-1 font-mono">
          <span className="truncate">
            {isNeeded ? (
              deficit > 0 ? (
                <span className="text-amber-400 font-bold">
                  Deficit: {formatNumber(deficit)}
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">
                  +{formatNumber(surplus)} Extra
                </span>
              )
            ) : (
              <span className="text-slate-500">—</span>
            )}
          </span>
          <span className="font-pixel text-[8px] text-slate-400">
            {isNeeded ? `${progress}%` : ''}
          </span>
        </div>

        {/* Pixel style progress bar */}
        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-200 rounded-full ${
              isFulfilled
                ? 'bg-emerald-400'
                : isNeeded
                ? 'bg-amber-400'
                : 'bg-slate-700'
            }`}
            style={{ width: `${isNeeded ? progress : 0}%` }}
          />
        </div>
      </div>
    </button>
  );
};
