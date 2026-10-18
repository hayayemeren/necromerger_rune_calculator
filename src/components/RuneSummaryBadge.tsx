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
      className={`group relative text-left transition-all duration-200 rounded-xl p-3 border backdrop-blur-md flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-${rune}-500 ${
        isNeeded
          ? `${meta.bgClass} ${meta.borderClass} hover:border-slate-400 hover:shadow-lg`
          : 'bg-slate-900/40 border-slate-800/80 opacity-60 hover:opacity-90'
      }`}
      style={{
        boxShadow: isNeeded && deficit > 0 ? `0 0 15px -4px ${meta.accentGlow}` : undefined,
      }}
    >
      {/* Top Header: Icon, Name & Status Icon */}
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2">
          <RuneIcon type={rune} size="sm" glow={isNeeded} />
          <div>
            <span className={`text-xs font-semibold tracking-wider uppercase ${meta.textClass}`}>
              {rune}
            </span>
            <div className="text-[10px] text-slate-400 leading-none">Rune</div>
          </div>
        </div>

        {isNeeded && (
          <div>
            {isFulfilled ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/70 px-2 py-0.5 rounded-full border border-rose-500/30">
                <AlertCircle className="w-3 h-3" /> -{formatNumber(deficit)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Numbers: Required vs Stashed */}
      <div className="grid grid-cols-2 gap-2 text-xs py-1 border-t border-slate-800/60 w-full">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Needed</div>
          <div className="font-mono font-bold text-slate-100 text-sm">
            {formatNumber(grossRequired)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-slate-400">Stash</div>
          <div className="font-mono font-medium text-slate-300 text-sm">
            {formatNumber(owned)}
          </div>
        </div>
      </div>

      {/* Bottom Deficit Banner & Progress Bar */}
      <div className="mt-2 w-full">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-slate-400">
            {isNeeded ? (
              deficit > 0 ? (
                <span className="text-amber-400 font-semibold font-mono">
                  Deficit: {formatNumber(deficit)}
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold font-mono">
                  +{formatNumber(surplus)} Extra
                </span>
              )
            ) : (
              <span className="text-slate-500">None required</span>
            )}
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            {isNeeded ? `${progress}%` : '—'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden border border-slate-800/80">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isFulfilled
                ? 'bg-emerald-400'
                : isNeeded
                ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                : 'bg-slate-700'
            }`}
            style={{ width: `${isNeeded ? progress : 0}%` }}
          />
        </div>
      </div>
    </button>
  );
};
