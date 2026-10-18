import React, { useState } from 'react';
import {
  LegendaryCalculationResult,
  LegendaryDef,
  LegendaryState,
  RuneType,
  StationLevel,
} from '../types/game';
import { LegendaryArt } from './LegendaryArt';
import { RuneIcon } from './RuneIcon';
import { RUNES } from '../data/gameData';
import { formatNumber, stationLevelToL1 } from '../utils/calculator';
import {
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Droplets,
  Moon,
  ShieldCheck,
  RotateCcw,
  Layers,
} from 'lucide-react';

interface LegendaryCardProps {
  def: LegendaryDef;
  state: LegendaryState;
  calculation: LegendaryCalculationResult;
  onSetQuantity: (quantity: number) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onToggleKeepReplacement: (keep: boolean) => void;
  onSetOwnedStation: (level: StationLevel, count: number) => void;
  onClearOwnedStations: () => void;
}

export const LegendaryCard: React.FC<LegendaryCardProps> = ({
  def,
  state,
  calculation,
  onSetQuantity,
  onIncrement,
  onDecrement,
  onToggleKeepReplacement,
  onSetOwnedStation,
  onClearOwnedStations,
}) => {
  const [isOwnedExpanded, setIsOwnedExpanded] = useState<boolean>(false);

  const { quantity, keepReplacement, ownedStations } = state;
  const {
    grossL5Stations,
    grossL1Stations,
    ownedL1Equivalent,
    netL1StationsNeeded,
    runesRequired,
  } = calculation;

  const isSelected = quantity > 0;

  return (
    <div
      className={`relative rounded-2xl transition-all duration-300 border flex flex-col justify-between overflow-hidden ${
        isSelected
          ? 'bg-slate-900/95 border-slate-700/80 shadow-xl'
          : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700/60'
      }`}
      style={{
        boxShadow: isSelected ? `0 0 20px -5px ${def.glowColor}` : undefined,
      }}
    >
      {/* Accent top glow bar */}
      <div
        className="h-1 w-full"
        style={{
          backgroundColor: isSelected ? def.accentColor : 'transparent',
          opacity: isSelected ? 0.9 : 0,
        }}
      />

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Card Header: Portrait + Name + Station + Buff Badges */}
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <LegendaryArt id={def.id} className="w-16 h-16 sm:w-20 sm:h-20 shrink-0" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold font-serif tracking-wide text-white truncate">
                {def.name}
              </h3>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {def.category}
              </span>
            </div>

            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span>Spawner:</span>
              <span className="font-semibold text-slate-200">{def.stationName}</span>
              <span className="text-[11px] text-slate-500 font-mono">(Tier L5)</span>
            </div>

            {/* Buff Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3 text-amber-400" />
                +{def.buffs.timeShards}% Shards
              </span>

              {def.buffs.maxMana && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-300 bg-sky-950/60 border border-sky-500/40 px-2 py-0.5 rounded-md">
                  <Zap className="w-3 h-3 text-sky-400" />
                  +{def.buffs.maxMana}% Mana
                </span>
              )}

              {def.buffs.maxSlime && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                  <Droplets className="w-3 h-3 text-emerald-400" />
                  +{def.buffs.maxSlime}% Slime
                </span>
              )}

              {def.buffs.maxDarkness && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 bg-purple-950/60 border border-purple-500/40 px-2 py-0.5 rounded-md">
                  <Moon className="w-3 h-3 text-purple-400" />
                  +{def.buffs.maxDarkness}% Darkness
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Target Stepper & Replacement Toggle */}
        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 mb-3 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Target Quantity
            </span>

            {/* Stepper controls */}
            <div className="inline-flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-inner">
              <button
                type="button"
                onClick={onDecrement}
                disabled={quantity <= 0}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                aria-label={`Decrease ${def.name} target`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <input
                type="number"
                min="0"
                max="99"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onSetQuantity(isNaN(val) ? 0 : val);
                }}
                className="w-12 h-8 text-center bg-transparent font-mono font-bold text-sm text-white focus:outline-none focus:bg-slate-800/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label={`${def.name} target quantity`}
              />

              <button
                type="button"
                onClick={onIncrement}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label={`Increase ${def.name} target`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Keep Replacement Spawner Switch */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
            <div className="text-left">
              <label
                htmlFor={`keep-spawner-${def.id}`}
                className="text-xs font-medium text-slate-200 cursor-pointer flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Keep +1 Replacement Spawner
              </label>
              <div className="text-[10px] text-slate-400">
                {keepReplacement
                  ? 'Builds 3× L5 (48 L1s) so 1 remains in lair'
                  : 'Consumes 2× L5 (32 L1s) — 0 spawners left'}
              </div>
            </div>

            <button
              id={`keep-spawner-${def.id}`}
              type="button"
              role="switch"
              aria-checked={keepReplacement}
              onClick={() => onToggleKeepReplacement(!keepReplacement)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                keepReplacement ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  keepReplacement ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Station Math Summary Row */}
        <div className="grid grid-cols-3 gap-2 text-center bg-slate-950/40 rounded-xl p-2.5 border border-slate-800/60 mb-3 text-xs">
          <div>
            <div className="text-[10px] uppercase text-slate-400 font-mono">Gross L5 / L1</div>
            <div className="font-mono font-semibold text-slate-200 mt-0.5">
              {grossL5Stations} L5 <span className="text-slate-400 font-normal">({grossL1Stations})</span>
            </div>
          </div>

          <div className="border-x border-slate-800/60 px-1">
            <div className="text-[10px] uppercase text-slate-400 font-mono">Owned Credit</div>
            <div className="font-mono font-semibold text-emerald-400 mt-0.5">
              -{ownedL1Equivalent} L1
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase text-slate-400 font-mono">Net L1 Needed</div>
            <div className="font-mono font-bold text-amber-300 mt-0.5 text-sm">
              {formatNumber(netL1StationsNeeded)}
            </div>
          </div>
        </div>

        {/* Runes Needed for this Legendary */}
        <div className="mb-3">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Runes Required for this Target:</span>
            {netL1StationsNeeded === 0 && quantity > 0 && (
              <span className="text-[10px] font-semibold text-emerald-400 font-mono">
                Fully Covered by Owned Stations!
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.entries(def.baseL1Cost) as [RuneType, number][]).map(([rune, baseCost]) => {
              const meta = RUNES[rune];
              const totalCost = runesRequired[rune] || 0;

              return (
                <div
                  key={rune}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border flex-1 min-w-[120px] ${
                    isSelected ? meta.bgClass : 'bg-slate-950/60'
                  } ${meta.borderClass}`}
                >
                  <RuneIcon type={rune} size="sm" glow={isSelected && totalCost > 0} />
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <span>{meta.name}</span>
                      <span className="text-slate-500">({baseCost}/L1)</span>
                    </div>
                    <div className={`font-mono font-bold text-sm ${meta.textClass}`}>
                      {formatNumber(totalCost)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collapsible Accordion: Subtract Owned Stations (L1-L5) */}
        <div className="mt-auto border-t border-slate-800/80 pt-2.5">
          <button
            type="button"
            onClick={() => setIsOwnedExpanded(!isOwnedExpanded)}
            className="w-full flex items-center justify-between text-xs font-medium text-slate-300 hover:text-white transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <span>Subtract Owned Stations (L1–L5)</span>
              {ownedL1Equivalent > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-semibold">
                  {ownedL1Equivalent} L1 Equiv
                </span>
              )}
            </span>
            {isOwnedExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {isOwnedExpanded && (
            <div className="mt-3 p-3 bg-slate-950/90 rounded-xl border border-slate-800/90 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Enter existing {def.stationName} stations in lair:</span>
                {ownedL1Equivalent > 0 && (
                  <button
                    type="button"
                    onClick={onClearOwnedStations}
                    className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors text-[10px]"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              {/* Station level offset inputs (L1 through L5) */}
              <div className="grid grid-cols-5 gap-1.5">
                {([1, 2, 3, 4, 5] as StationLevel[]).map((lvl) => {
                  const power = stationLevelToL1(lvl);
                  const count = ownedStations[lvl] || 0;

                  return (
                    <div
                      key={lvl}
                      className="flex flex-col items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1.5"
                    >
                      <span className="text-[10px] font-bold font-mono text-slate-300">
                        L{lvl}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono mb-1">
                        ({power} L1)
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={count === 0 ? '' : count}
                        placeholder="0"
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          onSetOwnedStation(lvl, isNaN(val) ? 0 : val);
                        }}
                        className="w-full text-center bg-slate-950 border border-slate-700/80 rounded py-1 text-xs font-mono font-semibold text-emerald-400 focus:outline-none focus:border-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between font-mono">
                <span>Power: L1=1, L2=2, L3=4, L4=8, L5=16</span>
                <span className="text-emerald-400 font-semibold">
                  Saved: {ownedL1Equivalent} L1
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
