import React from 'react';
import { AggregateCalculationResult, LegendaryId } from '../types/game';
import { LEGENDARIES } from '../data/gameData';
import { formatNumber } from '../utils/calculator';
import {
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
  Circle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface TimeMachineCalculatorProps {
  aggregate: AggregateCalculationResult;
  devourerLevel: number;
  featTier: number;
  otherBoostPercent: number;
  groupUpgradeLevel: number;
  onSetDevourerLevel: (level: number) => void;
  onSetFeatTier: (tier: number) => void;
  onSetOtherBoostPercent: (percent: number) => void;
  onSetGroupUpgradeLevel: (level: number) => void;
}

export const TimeMachineCalculator: React.FC<TimeMachineCalculatorProps> = ({
  aggregate,
  devourerLevel,
  featTier,
  otherBoostPercent,
  groupUpgradeLevel,
  onSetDevourerLevel,
  onSetFeatTier,
  onSetOtherBoostPercent,
  onSetGroupUpgradeLevel,
}) => {
  const { timeShardsEstimate } = aggregate;
  const {
    baseShards,
    featBonusPercent,
    legendariesBonusPercent,
    groupsBonusPercent,
    totalLegendariesAndGroupsPercent,
    otherBonusPercent,
    totalMultiplier,
    totalTimeShards,
    groups,
  } = timeShardsEstimate;

  const quickLevels = [50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000];
  const quickFeats = [16, 19, 21, 22, 25, 28, 29, 30];

  return (
    <section className="bg-slate-900 border-4 border-slate-700 rounded-2xl shadow-pixel p-4 sm:p-6 mb-8 relative overflow-hidden">
      {/* Decorative Arcade Header Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-purple-500 to-teal-500" />

      {/* Main Title Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 pb-5 border-b-2 border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-950/80 border-2 border-amber-500 rounded-xl flex items-center justify-center p-2 shadow-pixel-amber shrink-0">
            <img
              src="/images/runes/time_shard.png"
              alt="Time Shard"
              className="w-full h-full object-contain [image-rendering:pixelated]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-pixel text-xs sm:text-sm text-amber-300 tracking-wider">
                TIME MACHINE // PRESTIGE SHARDS
              </h2>
              <span className="font-pixel text-[9px] px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-500 rounded">
                LIVE CALCULATOR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Devourer Level Base × Feats Multiplier × (Legendaries + Groups) × Other Boosts
            </p>
          </div>
        </div>

        {/* Large Retro Arcade Shards Readout */}
        <div className="bg-slate-950 border-2 border-amber-500/80 rounded-xl p-3 sm:p-4 shadow-pixel flex items-center justify-between sm:justify-end gap-4 min-w-[240px]">
          <div className="text-left sm:text-right">
            <div className="text-[10px] uppercase font-pixel text-slate-400 tracking-wide">
              Projected Payout
            </div>
            <div className="font-pixel text-lg sm:text-2xl text-amber-300 tracking-wider flex items-center gap-2 sm:justify-end">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span>{formatNumber(totalTimeShards)}</span>
            </div>
          </div>
          <div className="text-right border-l-2 border-slate-800 pl-3">
            <div className="text-[9px] font-mono text-slate-400">Total Multiplier</div>
            <div className="font-pixel text-xs text-teal-400">
              {totalMultiplier.toFixed(2)}x
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Interactive Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 1. Devourer Level Input */}
        <div className="bg-slate-950/80 border-2 border-slate-800 rounded-xl p-3.5 shadow-pixel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="devourer-level-input"
                className="font-pixel text-[10px] text-slate-300 flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                Devourer Level
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onSetDevourerLevel(devourerLevel - 1)}
                  disabled={devourerLevel <= 35}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 disabled:opacity-30 font-pixel text-xs"
                  aria-label="Decrease Devourer Level"
                >
                  -
                </button>
                <input
                  type="number"
                  min="35"
                  max="1000"
                  value={devourerLevel || ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === '') {
                      onSetDevourerLevel(0);
                      return;
                    }
                    const val = parseInt(raw, 10);
                    if (!isNaN(val)) {
                      onSetDevourerLevel(val);
                    }
                  }}
                  onBlur={() => {
                    if (!devourerLevel || devourerLevel < 35) {
                      onSetDevourerLevel(35);
                    }
                  }}
                  className="w-16 text-center bg-slate-900 border border-slate-700 rounded py-0.5 font-mono text-xs text-indigo-300 font-bold"
                />
                <button
                  type="button"
                  onClick={() => onSetDevourerLevel(devourerLevel + 1)}
                  disabled={devourerLevel >= 1000}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 disabled:opacity-30 font-pixel text-xs"
                  aria-label="Increase Devourer Level"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mb-2">
              Base Shards: <strong className="text-amber-400">{formatNumber(baseShards)}</strong>
            </div>

            <input
              id="devourer-level-input"
              type="range"
              min="35"
              max="1000"
              value={Math.max(35, Math.min(1000, devourerLevel))}
              onChange={(e) => onSetDevourerLevel(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Quick preset level buttons */}
          <div className="flex items-center gap-1 flex-wrap mt-3 pt-2 border-t border-slate-800/80">
            {quickLevels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onSetDevourerLevel(lvl)}
                className={`text-[8px] font-pixel px-1.5 py-0.5 rounded border transition-colors ${
                  devourerLevel === lvl
                    ? 'bg-indigo-600 text-white border-indigo-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Feat Tier Input */}
        <div className="bg-slate-950/80 border-2 border-slate-800 rounded-xl p-3.5 shadow-pixel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="feat-tier-input"
                className="font-pixel text-[10px] text-slate-300 flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                Completed Feats
              </label>
              <span className="font-mono text-xs text-yellow-300 font-bold">
                Tier {featTier}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mb-2">
              Multiplier: <strong className="text-yellow-400">{featBonusPercent}%</strong> ({ (featBonusPercent / 100).toFixed(1) }x)
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSetFeatTier(featTier - 1)}
                disabled={featTier <= 0}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 disabled:opacity-30 font-pixel text-xs"
              >
                -
              </button>
              <input
                id="feat-tier-input"
                type="number"
                min="0"
                max="50"
                value={featTier}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === '') {
                    onSetFeatTier(0);
                    return;
                  }
                  const val = parseInt(raw, 10);
                  if (!isNaN(val)) {
                    onSetFeatTier(val);
                  }
                }}
                className="flex-1 text-center bg-slate-900 border border-slate-700 rounded py-1 font-pixel text-xs text-yellow-300"
              />
              <button
                type="button"
                onClick={() => onSetFeatTier(featTier + 1)}
                disabled={featTier >= 50}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 disabled:opacity-30 font-pixel text-xs"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-[9px] text-slate-500 font-mono mt-1">
            Base 100% + 10% per completed Feat
          </div>

          {/* Quick milestone feat buttons */}
          <div className="flex items-center gap-1 flex-wrap mt-3 pt-2 border-t border-slate-800/80">
            {quickFeats.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => onSetFeatTier(tier)}
                className={`text-[8px] font-pixel px-1.5 py-0.5 rounded border transition-colors ${
                  featTier === tier
                    ? 'bg-amber-600 text-white border-amber-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title={`Jump to Feat Tier ${tier}`}
              >
                T{tier}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Group Scaling Upgrade (The Hacker's Upgrade) */}
        <div className="bg-slate-950/80 border-2 border-slate-800 rounded-xl p-3.5 shadow-pixel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="group-upgrade-input"
                className="font-pixel text-[10px] text-teal-300 flex items-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                Group Upgrade
              </label>
              <span className="font-mono text-xs text-teal-300 font-bold">
                Lvl {groupUpgradeLevel}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mb-2">
              Max Sets: <strong className="text-teal-400">{groupUpgradeLevel + 1} sets</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSetGroupUpgradeLevel(groupUpgradeLevel - 1)}
                disabled={groupUpgradeLevel <= 0}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 disabled:opacity-30 font-pixel text-xs"
              >
                -
              </button>
              <input
                id="group-upgrade-input"
                type="number"
                min="0"
                max="10"
                value={groupUpgradeLevel}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onSetGroupUpgradeLevel(isNaN(val) ? 0 : val);
                }}
                className="flex-1 text-center bg-slate-900 border border-slate-700 rounded py-1 font-pixel text-xs text-teal-300"
              />
              <button
                type="button"
                onClick={() => onSetGroupUpgradeLevel(groupUpgradeLevel + 1)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-pixel text-xs"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-[9px] text-slate-500 font-mono mt-3 pt-2 border-t border-slate-800/80">
            Allows claiming up to {groupUpgradeLevel + 1} completed sets per group
          </div>
        </div>

        {/* 4. Other Shard Boosts Input (Inventor, Skins, Relics) */}
        <div className="bg-slate-950/80 border-2 border-slate-800 rounded-xl p-3.5 shadow-pixel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="other-boost-input"
                className="font-pixel text-[10px] text-purple-300 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Other Boosts %
              </label>
              <span className="font-mono text-xs text-purple-300 font-bold">
                {otherBonusPercent}% ({(otherBonusPercent / 100).toFixed(1)}x)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mb-2">
              Skins, Relics & Experiments (Base: 100%)
            </div>

            <div className="flex items-center gap-1">
              <input
                id="other-boost-input"
                type="number"
                min="0"
                max="1000"
                value={otherBoostPercent}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onSetOtherBoostPercent(isNaN(val) ? 0 : val);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded py-1 px-2 font-pixel text-xs text-purple-300"
                placeholder="100"
              />
              <span className="font-pixel text-xs text-slate-400">%</span>
            </div>
          </div>

          {/* Quick boost shortcuts */}
          <div className="flex items-center gap-1 flex-wrap mt-3 pt-2 border-t border-slate-800/80">
            {[100, 150, 200, 240, 300].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onSetOtherBoostPercent(val)}
                className={`text-[8px] font-pixel px-1.5 py-1 rounded border transition-colors ${
                  otherBoostPercent === val
                    ? 'bg-purple-700 text-white border-purple-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {val === 100 ? '100% (Base)' : `${val}%`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legendary Groups Status Section */}
      <div className="bg-slate-950/90 border-2 border-slate-800 rounded-xl p-4 shadow-pixel mb-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[11px] text-slate-200">
              LEGENDARY SET GROUPS
            </span>
            <span className="font-mono text-xs text-teal-400">
              (+{groupsBonusPercent}% from {groups.filter((g) => g.isComplete).length}/4 complete sets)
            </span>
          </div>

          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            Complete matching sets of all members to claim group bonuses!
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {groups.map((grp) => {
            const hasSets = grp.claimedSets > 0;
            return (
              <div
                key={grp.group}
                className={`p-3 rounded-xl border-2 transition-all ${
                  hasSets
                    ? 'bg-teal-950/60 border-teal-500 shadow-pixel-teal'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-pixel text-[9px] text-slate-300 truncate">
                    {grp.name.split(':')[0]}
                  </span>
                  {hasSets ? (
                    <span className="font-pixel text-[8px] bg-teal-500 text-slate-950 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {grp.claimedSets} SET{grp.claimedSets > 1 ? 'S' : ''}
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-slate-500 flex items-center gap-1">
                      <Circle className="w-2.5 h-2.5" /> {grp.ownedMembers.length}/{grp.members.length}
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <div className="text-xs font-mono font-bold text-amber-300">
                    +{grp.effectiveBonus}% Shards
                    {hasSets && grp.claimedSets > 1 && (
                      <span className="text-[10px] text-teal-400 font-mono font-normal ml-1">
                        ({grp.claimedSets}×{grp.baseBonus}%)
                      </span>
                    )}
                    {!hasSets && (
                      <span className="text-[10px] text-slate-500 font-mono font-normal ml-1">
                        (Base: +{grp.baseBonus}%)
                      </span>
                    )}
                  </div>
                  {grp.completeSets > grp.claimedSets && (
                    <div className="text-[9px] font-mono text-amber-400">
                      {grp.completeSets} sets built (cap: {grp.claimedSets})
                    </div>
                  )}
                </div>

                {/* Member icons list with quantities */}
                <div className="flex items-center gap-2 pt-1.5 border-t border-slate-800/80">
                  {grp.members.map((memberId: LegendaryId) => {
                    const calc = aggregate.byLegendary[memberId];
                    const qty = calc?.totalBoardQuantity ?? 0;
                    const inLair = calc?.lairQuantity ?? 0;
                    const toCraft = calc?.quantity ?? 0;
                    const isOwned = qty > 0;
                    const def = LEGENDARIES[memberId];

                    return (
                      <div
                        key={memberId}
                        className={`relative w-8 h-8 rounded border p-0.5 transition-all ${
                          isOwned
                            ? 'bg-slate-800 border-teal-400 opacity-100 shadow-sm'
                            : 'bg-slate-950 border-slate-800 opacity-35 grayscale'
                        }`}
                        title={`${def.name}: ${qty} on board (${inLair} in lair + ${toCraft} to craft)`}
                      >
                        <img
                          src={def.imageSrc}
                          alt={def.name}
                          className="w-full h-full object-contain [image-rendering:pixelated]"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 text-[8px] font-mono font-bold px-1 rounded border leading-none py-0.5 ${
                            isOwned
                              ? 'bg-slate-900 border-teal-400 text-teal-300'
                              : 'bg-slate-950 border-slate-700 text-slate-500'
                          }`}
                        >
                          x{qty}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Multiplier Math Breakdown Bar */}
      <div className="p-3 bg-slate-950 border-2 border-slate-800 rounded-xl text-xs font-mono text-slate-300 flex flex-wrap items-center justify-between gap-3">
        <span className="font-pixel text-[9px] text-slate-400">FORMULA:</span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">
            Base: <strong className="text-amber-300">{formatNumber(baseShards)}</strong>
          </span>
          <span className="text-slate-500 font-bold">×</span>
          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">
            Feats: <strong className="text-yellow-300">{featBonusPercent}% ({(featBonusPercent / 100).toFixed(1)}x)</strong>
          </span>
          <span className="text-slate-500 font-bold">×</span>
          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">
            Legendaries & Sets:{' '}
            <strong className="text-teal-300">
              {totalLegendariesAndGroupsPercent}% ({(totalLegendariesAndGroupsPercent / 100).toFixed(2)}x)
            </strong>
            <span className="text-[10px] text-slate-400 ml-1">
              (100% + {legendariesBonusPercent}% + {groupsBonusPercent}%)
            </span>
          </span>
          <span className="text-slate-500 font-bold">×</span>
          <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">
            Other: <strong className="text-purple-300">{otherBonusPercent}% ({(otherBonusPercent / 100).toFixed(1)}x)</strong>
          </span>
          <span className="text-slate-500 font-bold">=</span>
          <span className="bg-amber-950/80 px-3 py-1 rounded border-2 border-amber-500 font-pixel text-xs text-amber-300 shadow-pixel-amber">
            {formatNumber(totalTimeShards)} SHARDS
          </span>
        </div>
      </div>
    </section>
  );
};
