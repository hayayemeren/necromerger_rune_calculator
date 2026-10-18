import React from 'react';
import { AggregateCalculationResult, RuneType, StashState } from '../types/game';
import { RUNE_ORDER } from '../data/gameData';
import { RuneSummaryBadge } from './RuneSummaryBadge';
import { StatsTracker } from './StatsTracker';
import { formatNumber } from '../utils/calculator';
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

  const totalBankedRunes = Object.values(stash).reduce((sum, val) => sum + (val || 0), 0);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b-4 border-slate-800 shadow-2xl transition-all">
      {/* Top Bar: Title & Global Action Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border-2 border-purple-500 flex items-center justify-center shadow-pixel shrink-0">
              <Skull className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-pixel text-xs sm:text-sm text-white tracking-wider">
                  NECROMERGER <span className="text-purple-400">CALCULATOR</span>
                </h1>
                <span className="font-pixel text-[8px] uppercase px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500">
                  ARCADE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Pixel-accurate station fusing, owned offsets, and live prestige shards
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Global Spawner Preservation Toggle */}
            <button
              type="button"
              onClick={onToggleGlobalKeepReplacement}
              className={`text-xs font-mono font-bold px-3 py-2 rounded-xl border-2 transition-all flex items-center gap-1.5 shadow-pixel-sm active:translate-y-0.5 ${
                globalKeepReplacement
                  ? 'bg-teal-950 border-teal-400 text-teal-300 shadow-pixel-teal'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle keeping 1 replacement spawner (3x L5 instead of 2x L5) for all legendaries"
            >
              {globalKeepReplacement ? (
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-slate-400" />
              )}
              <span>
                {globalKeepReplacement ? 'Preserve: ON' : 'Preserve: OFF'}
              </span>
            </button>

            {/* Quick Presets */}
            <button
              type="button"
              onClick={onOpenPresets}
              className="text-xs font-mono font-bold px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-300 border-2 border-indigo-500/60 shadow-pixel-sm flex items-center gap-1.5 active:translate-y-0.5 transition-transform"
            >
              <Bookmark className="w-4 h-4 text-indigo-400" />
              <span>Presets</span>
            </button>

            {/* Banked Runes Drawer Toggle */}
            <button
              type="button"
              onClick={() => onOpenStash()}
              className="text-xs font-mono font-bold px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border-2 border-amber-500/60 shadow-pixel-sm flex items-center gap-1.5 active:translate-y-0.5 transition-transform"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Banked Runes</span>
              {totalBankedRunes > 0 && (
                <span className="font-pixel text-[8px] px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded">
                  {formatNumber(totalBankedRunes)}
                </span>
              )}
            </button>

            {/* Guide Button */}
            <button
              type="button"
              onClick={onOpenGuide}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-2 border-slate-700 shadow-pixel-sm transition-transform active:translate-y-0.5"
              title="Game Guide & Rules"
              aria-label="How it works"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Reset Menu */}
            <div className="flex items-center bg-slate-900 border-2 border-slate-700 rounded-xl overflow-hidden shadow-pixel-sm">
              <button
                type="button"
                onClick={onResetTargets}
                className="px-2.5 py-2 text-xs font-mono font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset targets to 0"
              >
                Clear Goals
              </button>
              <button
                type="button"
                onClick={onResetFull}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 border-l-2 border-slate-700 transition-colors"
                title="Full Factory Reset"
                aria-label="Full Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Cumulative Stats Tracker */}
        <div className="mt-2.5">
          <StatsTracker aggregate={aggregate} />
        </div>

        {/* Sticky Rune Summary Badges Grid (All 8 Runes) */}
        <div className="mt-2.5 pt-2.5 border-t-2 border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-pixel text-[9px] text-slate-400 tracking-wider uppercase">
              Rune Requirements & Deficits
            </span>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              Click any rune to adjust your banked stash
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
