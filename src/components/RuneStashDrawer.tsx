import React from 'react';
import { RuneType, StashState } from '../types/game';
import { RUNES, RUNE_ORDER } from '../data/gameData';
import { RuneIcon } from './RuneIcon';
import { formatNumber } from '../utils/calculator';
import { X, RotateCcw, CheckCheck, Coins, ArrowRight } from 'lucide-react';

interface RuneStashDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stash: StashState;
  totalRunesGross: Record<RuneType, number>;
  totalRunesDeficit: Record<RuneType, number>;
  onSetStashRune: (rune: RuneType, amount: number) => void;
  onAdjustStashRune: (rune: RuneType, delta: number) => void;
  onClearStash: () => void;
  onFillStashToMatchRequired: () => void;
}

export const RuneStashDrawer: React.FC<RuneStashDrawerProps> = ({
  isOpen,
  onClose,
  stash,
  totalRunesGross,
  totalRunesDeficit,
  onSetStashRune,
  onAdjustStashRune,
  onClearStash,
  onFillStashToMatchRequired,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stash-drawer-title"
    >
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-md bg-slate-900 border-l-4 border-slate-700 h-full shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-950 border border-amber-500 text-amber-400 rounded-xl shadow-pixel-sm">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 id="stash-drawer-title" className="font-pixel text-xs sm:text-sm text-white tracking-wider">
                BANKED RUNES STASH
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Input your vault runes to update live deficits
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close inventory drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Stash Actions */}
        <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onFillStashToMatchRequired}
            className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-teal-950 hover:bg-teal-900 text-teal-300 border-2 border-teal-500 shadow-pixel-sm flex items-center gap-1.5 transition-all active:translate-y-0.5"
          >
            <CheckCheck className="w-4 h-4 text-teal-400" />
            Match All Needed
          </button>

          <button
            type="button"
            onClick={onClearStash}
            className="text-xs font-mono px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Stash
          </button>
        </div>

        {/* Rune Inputs List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {RUNE_ORDER.map((rune) => {
            const meta = RUNES[rune];
            const owned = stash[rune] || 0;
            const gross = totalRunesGross[rune] || 0;
            const deficit = totalRunesDeficit[rune] || 0;
            const isNeeded = gross > 0;

            return (
              <div
                key={rune}
                className={`p-3 rounded-xl border-2 shadow-pixel-sm transition-all ${
                  isNeeded
                    ? `${meta.bgClass} ${meta.borderClass}`
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <RuneIcon type={rune} size="sm" glow={isNeeded} />
                    <span className={`font-pixel text-[10px] uppercase tracking-wider ${meta.textClass}`}>
                      {meta.name}
                    </span>
                  </div>

                  {/* Summary status */}
                  <div className="text-right text-xs">
                    {isNeeded ? (
                      deficit > 0 ? (
                        <span className="text-amber-400 font-mono font-bold">
                          Deficit: -{formatNumber(deficit)}
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-pixel text-[9px]">
                          READY!
                        </span>
                      )
                    ) : (
                      <span className="text-slate-500 text-[10px] font-mono">None Needed</span>
                    )}
                  </div>
                </div>

                {/* Input and quick delta buttons */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      value={owned === 0 ? '' : owned}
                      placeholder="0"
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onSetStashRune(rune, isNaN(val) ? 0 : val);
                      }}
                      className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  {/* Quick delta buttons */}
                  <div className="flex items-center gap-1 font-pixel text-[9px]">
                    <button
                      type="button"
                      onClick={() => onAdjustStashRune(rune, 20)}
                      className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 active:translate-y-0.5"
                      title="Add 20 runes"
                    >
                      +20
                    </button>
                    <button
                      type="button"
                      onClick={() => onAdjustStashRune(rune, 100)}
                      className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 active:translate-y-0.5"
                      title="Add 100 runes"
                    >
                      +100
                    </button>
                    <button
                      type="button"
                      onClick={() => onAdjustStashRune(rune, 500)}
                      className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 active:translate-y-0.5"
                      title="Add 500 runes"
                    >
                      +500
                    </button>
                  </div>
                </div>

                {/* Comparison status line */}
                {isNeeded && (
                  <div className="mt-2 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Target Gross: {formatNumber(gross)}</span>
                    <span className="flex items-center gap-1">
                      <span>Stashed: {formatNumber(owned)}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className={deficit === 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {deficit === 0 ? 'Fully Covered' : `Deficit: ${formatNumber(deficit)}`}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t-2 border-slate-800 bg-slate-950">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 bg-purple-700 hover:bg-purple-600 text-white font-pixel text-xs tracking-wider rounded-xl transition-all shadow-pixel active:translate-y-0.5"
          >
            APPLY & CLOSE INVENTORY
          </button>
        </div>
      </div>
    </div>
  );
};
