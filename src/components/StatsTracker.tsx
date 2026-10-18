import React from 'react';
import { AggregateCalculationResult } from '../types/game';
import { Sparkles, Zap, Droplets, Moon, Trophy } from 'lucide-react';
import { formatNumber } from '../utils/calculator';

interface StatsTrackerProps {
  aggregate: AggregateCalculationResult;
}

export const StatsTracker: React.FC<StatsTrackerProps> = ({ aggregate }) => {
  const { totalBuffs, totalLegendariesCount, totalBaseStationsNeeded, isAllFulfilled } = aggregate;

  return (
    <div className="w-full">
      {/* Celebration Banner when all target legendaries are completely fulfilled */}
      {isAllFulfilled && (
        <div className="mb-3 p-3 bg-emerald-950/90 border-2 border-emerald-400 rounded-xl flex items-center justify-between shadow-pixel animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-500/30 text-emerald-300 rounded border border-emerald-400">
              <Trophy className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <div className="font-pixel text-[10px] text-emerald-300 tracking-wide">
                SUMMONING RUNES READY!
              </div>
              <div className="text-[11px] text-emerald-300/80 font-mono">
                Your stashed runes completely cover all targets and stations!
              </div>
            </div>
          </div>
          <span className="font-pixel text-[9px] bg-emerald-500 text-slate-950 px-2 py-1 rounded shadow-pixel-sm font-bold">
            100% READY
          </span>
        </div>
      )}

      {/* Grid of Cumulative Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {/* Time Shards Multiplier */}
        <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-slate-900 border-2 border-amber-500/70 rounded-xl p-2.5 shadow-pixel relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-pixel text-[9px] text-amber-300 tracking-wider">
                TIME SHARDS
              </span>
            </div>
            <span className="text-[9px] font-mono text-slate-400">Prestige Yield</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-pixel text-lg sm:text-xl text-amber-300 tracking-tight">
              +{totalBuffs.timeShards}%
            </span>
            <span className="text-[10px] text-slate-400 font-mono">From Legendaries</span>
          </div>
        </div>

        {/* Max Mana Cap */}
        <div className="bg-slate-900 border-2 border-sky-500/40 rounded-xl p-2.5 shadow-pixel">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Zap className="w-3 h-3 text-sky-400" />
            <span className="font-pixel text-[8px] text-sky-300">MANA</span>
          </div>
          <div className="font-pixel text-sm sm:text-base text-sky-200">
            +{totalBuffs.maxMana}%
          </div>
          <div className="text-[9px] text-slate-500 font-mono">Grave & Lectern</div>
        </div>

        {/* Max Slime Cap */}
        <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-xl p-2.5 shadow-pixel">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Droplets className="w-3 h-3 text-emerald-400" />
            <span className="font-pixel text-[8px] text-emerald-300">SLIME</span>
          </div>
          <div className="font-pixel text-sm sm:text-base text-emerald-200">
            +{totalBuffs.maxSlime}%
          </div>
          <div className="text-[9px] text-slate-500 font-mono">Cupboard & Fridge</div>
        </div>

        {/* Max Darkness Cap */}
        <div className="bg-slate-900 border-2 border-purple-500/40 rounded-xl p-2.5 shadow-pixel">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Moon className="w-3 h-3 text-purple-400" />
            <span className="font-pixel text-[8px] text-purple-300">DARKNESS</span>
          </div>
          <div className="font-pixel text-sm sm:text-base text-purple-200">
            +{totalBuffs.maxDarkness}%
          </div>
          <div className="text-[9px] text-slate-500 font-mono">Altar & Portal</div>
        </div>

        {/* Totals: Creatures & L1 Stations */}
        <div className="col-span-2 sm:col-span-1 md:col-span-1 bg-slate-900 border-2 border-slate-700 rounded-xl p-2.5 shadow-pixel flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[9px] font-pixel">
            <span>TARGETS</span>
            <span className="text-white font-bold">{totalLegendariesCount}</span>
          </div>
          <div className="mt-1 pt-1 border-t border-slate-800 text-[10px] text-slate-300 font-mono flex items-center justify-between">
            <span>Net L1s:</span>
            <span className="text-amber-400 font-bold">{formatNumber(totalBaseStationsNeeded)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
