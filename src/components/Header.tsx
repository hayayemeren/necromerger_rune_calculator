import React from 'react';
import { AggregateCalculationResult, RuneType, StashState } from '../types/game';
import { RUNE_ORDER } from '../data/gameData';
import { RuneSummaryBadge } from './RuneSummaryBadge';
import { StatsTracker } from './StatsTracker';
import {
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Bookmark,
  Coins,
  Skull,
  HelpCircle,
} from 'lucide-react';

interface HeaderProps {
  aggregate: AggregateCalculationResult;
  stash: StashState;
  globalKeepReplacement: boolean;
  onToggleGlobalKeepReplacement: () => void;
  onOpenPresets: () => void;
  onOpenStash: (runeFocus?: RuneType) => void;
  onResetTargets: () => void;
  onResetFull: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  aggregate,
  stash,
  globalKeepReplacement,
  onToggleGlobalKeepReplacement,
  onOpenPresets,
  onOpenStash,
  onResetTargets,
  onResetFull,
  onOpenGuide,
}) => {
  const { totalRunesGross, totalRunesDeficit, totalRunesSurplus, progressByRune } = aggregate;

  // Total banked runes count
  const totalBankedRunes = Object.values(stash).reduce((sum, val) => sum + (val || 0), 0);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl transition-all">
      {/* Top Bar: Title & Global Action Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-700 to-indigo-900 border border-purple-500/50 flex items-center justify-center shadow-lg shadow-purple-950/60 shrink-0">
              <Skull className="w-6 h-6 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold font-serif tracking-wide text-white">
                  NecroMerger <span className="text-purple-400 font-sans font-bold text-sm tracking-normal">Calculator</span>
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/40">
                  Legendary & Runes
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Station power scaling, owned offset deductions & time shard projections
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Global Spawner Preservation Toggle */}
            <button
              type="button"
              onClick={onToggleGlobalKeepReplacement}
              className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all duration-200 flex items-center gap-1.5 shadow-sm ${
                globalKeepReplacement
                  ? 'bg-teal-950/90 border-teal-500/60 text-teal-300 shadow-teal-950/50'
                  : 'bg-slate-900/90 border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle keeping 1 replacement spawner (3x L5 instead of 2x L5) for all legendaries"
            >
              {globalKeepReplacement ? (
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-slate-400" />
              )}
              <span>
                {globalKeepReplacement ? 'Preserve Spawners: ON' : 'Preserve Spawners: OFF'}
              </span>
            </button>

            {/* Quick Presets */}
            <button
              type="button"
              onClick={onOpenPresets}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Bookmark className="w-4 h-4 text-indigo-400" />
              <span>Presets</span>
            </button>

            {/* Banked Runes Drawer Toggle */}
            <button
              type="button"
              onClick={() => onOpenStash()}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Banked Runes</span>
              {totalBankedRunes > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-200 rounded-full">
                  {totalBankedRunes}
                </span>
              )}
            </button>

            {/* How it Works / Guide Button */}
            <button
              type="button"
              onClick={onOpenGuide}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              title="How legendary station fusing works in NecroMerger"
              aria-label="How it works"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Reset Menu */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={onResetTargets}
                className="px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset targets to 0 (keeps stash & owned stations)"
              >
                Clear Goals
              </button>
              <button
                type="button"
                onClick={onResetFull}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 border-l border-slate-700 transition-colors"
                title="Full factory reset"
                aria-label="Full Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Cumulative Stats Tracker */}
        <div className="mt-3">
          <StatsTracker aggregate={aggregate} />
        </div>

        {/* Sticky Rune Summary Badges Grid (All 8 Runes) */}
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Rune Requirements & Deficits
            </span>
            <span className="text-[11px] text-slate-500">
              Click any rune to adjust your banked inventory
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {RUNE_ORDER.map((rune) => (
              <RuneSummaryBadge
                key={rune}
                rune={rune}
                grossRequired={totalRunesGross[rune] || 0}
                owned={stash[rune] || 0}
                deficit={totalRunesDeficit[rune] || 0}
                surplus={totalRunesSurplus[rune] || 0}
                progress={progressByRune[rune] || 0}
                onClick={() => onOpenStash(rune)}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
