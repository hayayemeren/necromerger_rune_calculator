import React from 'react';
import { AggregateCalculationResult } from '../types/game';
import { Sparkles, Zap, Droplets, Moon, Trophy, Layers } from 'lucide-react';
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
        <div className="mb-4 p-3 bg-gradient-to-r from-emerald-950/80 via-teal-900/60 to-emerald-950/80 border border-emerald-500/50 rounded-xl flex items-center justify-between shadow-lg shadow-emerald-950/50 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-300">
                Summoning Runes Ready!
              </div>
              <div className="text-xs text-emerald-400/80">
                You have sufficient stashed runes to craft all target legendaries and stations!
              </div>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            100% Ready
          </span>
        </div>
      )}

      {/* Grid of Cumulative Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Time Shards Multiplier */}
        <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-gradient-to-br from-amber-950/40 via-slate-900 to-amber-950/20 border border-amber-500/40 rounded-xl p-3 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                Time Shards
              </span>
            </div>
            <span className="text-[11px] font-mono text-amber-400/80">Prestige Multiplier</span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono tracking-tight text-amber-300">
              +{totalBuffs.timeShards}%
            </span>
            <span className="text-xs text-slate-400">Total Shard Boost</span>
          </div>
        </div>

        {/* Max Mana Cap */}
        <div className="bg-slate-900/90 border border-sky-500/30 rounded-xl p-3 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-sky-500/20 text-sky-400 rounded-md">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-sky-300">Mana Cap</span>
          </div>
          <div className="text-xl font-bold font-mono text-sky-200">
            +{totalBuffs.maxMana}%
          </div>
          <div className="text-[10px] text-slate-400">Grave & Lectern</div>
        </div>

        {/* Max Slime Cap */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-md">
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-emerald-300">Slime Cap</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-200">
            +{totalBuffs.maxSlime}%
          </div>
          <div className="text-[10px] text-slate-400">Cupboard & Fridge</div>
        </div>

        {/* Max Darkness Cap */}
        <div className="bg-slate-900/90 border border-purple-500/30 rounded-xl p-3 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-purple-500/20 text-purple-400 rounded-md">
              <Moon className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-purple-300">Darkness Cap</span>
          </div>
          <div className="text-xl font-bold font-mono text-purple-200">
            +{totalBuffs.maxDarkness}%
          </div>
          <div className="text-[10px] text-slate-400">Altar & Portal</div>
        </div>

        {/* Total Legendaries & Net Base Stations */}
        <div className="col-span-2 sm:col-span-1 md:col-span-1 bg-slate-900/90 border border-slate-700/60 rounded-xl p-3 shadow-md flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target Legendaries</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-mono font-bold text-white">
              {totalLegendariesCount}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {formatNumber(totalBaseStationsNeeded)} L1s net
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
