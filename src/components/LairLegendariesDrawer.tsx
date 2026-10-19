import React from 'react';
import { LairLegendariesState, LegendaryId } from '../types/game';
import { LEGENDARIES, LEGENDARY_ORDER } from '../data/gameData';
import { X, RotateCcw, Skull, Sparkles } from 'lucide-react';

interface LairLegendariesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lairLegendaries: LairLegendariesState;
  craftQuantities: Record<LegendaryId, number>;
  onSetLairQuantity: (id: LegendaryId, count: number) => void;
  onIncrementLairQuantity: (id: LegendaryId) => void;
  onDecrementLairQuantity: (id: LegendaryId) => void;
  onClearLairLegendaries: () => void;
}

export const LairLegendariesDrawer: React.FC<LairLegendariesDrawerProps> = ({
  isOpen,
  onClose,
  lairLegendaries,
  craftQuantities,
  onSetLairQuantity,
  onIncrementLairQuantity,
  onDecrementLairQuantity,
  onClearLairLegendaries,
}) => {
  if (!isOpen) return null;

  const totalInLair = Object.values(lairLegendaries).reduce((sum, val) => sum + (val || 0), 0);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lair-legendaries-title"
    >
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full max-w-lg bg-slate-900 border-l-4 border-purple-600 h-full shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-950 border-2 border-purple-500 text-purple-300 rounded-xl shadow-pixel">
              <Skull className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="lair-legendaries-title"
                  className="font-pixel text-xs sm:text-sm text-white tracking-wider"
                >
                  MINIONS IN LAIR
                </h2>
                <span className="font-pixel text-[8px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500 rounded font-bold">
                  0 RUNES
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Already built on your board — boosts Time Shards & Groups for free
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close lair minions drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Lair Actions & Summary Bar */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Total in Lair:</span>
            <span className="font-bold text-amber-300 font-pixel text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
              {totalInLair} MINIONS
            </span>
          </div>

          <button
            type="button"
            onClick={onClearLairLegendaries}
            disabled={totalInLair === 0}
            className="text-xs font-mono px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Lair
          </button>
        </div>

        {/* Legendaries List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {LEGENDARY_ORDER.map((id) => {
            const def = LEGENDARIES[id];
            const lairCount = lairLegendaries[id] || 0;
            const craftCount = craftQuantities[id] || 0;
            const totalOnBoard = lairCount + craftCount;
            const max = def.maxQuantity;
            const isAtMax = max !== undefined && totalOnBoard >= max;
            const canIncrease = max === undefined || totalOnBoard < max;

            return (
              <div
                key={id}
                className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
                  lairCount > 0
                    ? 'bg-purple-950/40 border-purple-500/70 shadow-pixel-sm'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                {/* Minion Art & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 bg-slate-900 border-2 border-slate-700 rounded-xl p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={def.imageSrc}
                      alt={def.name}
                      className="w-full h-full object-contain [image-rendering:pixelated]"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-pixel text-[10px] text-white tracking-wide truncate">
                        {def.name}
                      </span>
                      {max !== undefined && (
                        <span className="font-pixel text-[8px] px-1 py-0.2 bg-slate-800 text-amber-300 border border-slate-700 rounded">
                          MAX: {max}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span>+{def.buffs.timeShards}% Shards</span>
                      {craftCount > 0 && (
                        <span className="text-teal-400">
                          (+{craftCount} queued to craft)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stepper Input */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onDecrementLairQuantity(id)}
                    disabled={lairCount <= 0}
                    className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 disabled:opacity-25 font-pixel text-xs flex items-center justify-center transition-colors active:translate-y-0.5"
                    aria-label={`Decrease ${def.name} in lair`}
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="0"
                    max={max ?? 99}
                    value={lairCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onSetLairQuantity(id, isNaN(val) ? 0 : val);
                    }}
                    className={`w-12 text-center bg-slate-900 border rounded-lg py-1 font-pixel text-xs ${
                      lairCount > 0
                        ? 'text-purple-300 border-purple-500 font-bold'
                        : 'text-slate-400 border-slate-700'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => onIncrementLairQuantity(id)}
                    disabled={!canIncrease}
                    className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 disabled:opacity-25 font-pixel text-xs flex items-center justify-center transition-colors active:translate-y-0.5"
                    aria-label={`Increase ${def.name} in lair`}
                    title={isAtMax ? `Reached maximum limit of ${max}` : undefined}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info banner */}
        <div className="p-3.5 bg-slate-950 border-t-2 border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Counted into all group bonuses & Time Machine</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-pixel text-[9px] rounded-lg shadow-pixel transition-all active:translate-y-0.5"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
