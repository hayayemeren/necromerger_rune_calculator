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
  Shield,
  Utensils,
  Copy,
  Flame,
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
  onSetSecondaryOwnedStation?: (level: StationLevel, count: number) => void;
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
  onSetSecondaryOwnedStation,
  onClearOwnedStations,
}) => {
  const [isOwnedExpanded, setIsOwnedExpanded] = useState<boolean>(false);
  const [activeStationTab, setActiveStationTab] = useState<'primary' | 'secondary'>('primary');

  const { quantity, keepReplacement, ownedStations, secondaryOwnedStations } = state;
  const {
    grossL5Stations,
    grossL1Stations,
    ownedL1Equivalent,
    secondaryOwnedL1Equivalent,
    netL1StationsNeeded,
    secondaryNetL1StationsNeeded,
    runesRequired,
  } = calculation;

  const isSelected = quantity > 0;

  return (
    <div
      className={`relative rounded-2xl transition-all duration-200 border-2 flex flex-col justify-between overflow-hidden shadow-pixel ${
        isSelected
          ? 'bg-slate-900 border-slate-600 shadow-pixel'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Pixel accent top stripe */}
      <div
        className="h-1.5 w-full transition-all"
        style={{
          backgroundColor: isSelected ? def.accentColor : 'transparent',
        }}
      />

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Card Header: Pixel Portrait + Name + Station + Buff Badges */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3">
          <LegendaryArt id={def.id} className="w-16 h-16 sm:w-20 sm:h-20 shrink-0" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <h3 className="font-pixel text-xs sm:text-sm text-white tracking-wide truncate">
                {def.name}
              </h3>
              <span className="font-pixel text-[8px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {def.category}
              </span>
            </div>

            {/* Station Spawner Details */}
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 flex-wrap font-mono">
              <span className="text-slate-500">Spawner:</span>
              <span className="font-bold text-slate-200">{def.stationName}</span>
              {def.secondaryStationName && (
                <>
                  <span className="text-slate-500">+</span>
                  <span className="font-bold text-slate-200">{def.secondaryStationName}</span>
                </>
              )}
              <span className="text-[10px] text-slate-500">(Tier L5)</span>
            </div>

            {/* Combination Recipe Banner */}
            {def.isCombination && def.combinationRecipe && (
              <div className="mt-1 text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/40 inline-flex items-center gap-1">
                <Flame className="w-3 h-3 text-indigo-400" />
                {def.combinationRecipe}
              </div>
            )}

            {/* Buff Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded">
                <Sparkles className="w-3 h-3 text-amber-400" />
                +{def.buffs.timeShards}% Shards
              </span>

              {def.buffs.maxMana && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-sky-300 bg-sky-950/70 border border-sky-500/40 px-2 py-0.5 rounded">
                  <Zap className="w-3 h-3 text-sky-400" />
                  +{def.buffs.maxMana}% Mana
                </span>
              )}

              {def.buffs.maxSlime && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded">
                  <Droplets className="w-3 h-3 text-emerald-400" />
                  +{def.buffs.maxSlime}% Slime
                </span>
              )}

              {def.buffs.maxDarkness && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-purple-300 bg-purple-950/70 border border-purple-500/40 px-2 py-0.5 rounded">
                  <Moon className="w-3 h-3 text-purple-400" />
                  +{def.buffs.maxDarkness}% Darkness
                </span>
              )}

              {def.buffs.shieldChance && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-teal-300 bg-teal-950/70 border border-teal-500/40 px-2 py-0.5 rounded">
                  <Shield className="w-3 h-3 text-teal-400" />
                  +{def.buffs.shieldChance}% Shield
                </span>
              )}

              {def.buffs.resourceGen && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-indigo-300 bg-indigo-950/70 border border-indigo-500/40 px-2 py-0.5 rounded">
                  <Zap className="w-3 h-3 text-indigo-400" />
                  +{def.buffs.resourceGen}% All Caps
                </span>
              )}

              {def.buffs.combatFood && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-lime-300 bg-lime-950/70 border border-lime-500/40 px-2 py-0.5 rounded">
                  <Utensils className="w-3 h-3 text-lime-400" />
                  Combat Food
                </span>
              )}

              {def.buffs.duplicateChance && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-300 bg-rose-950/70 border border-rose-500/40 px-2 py-0.5 rounded">
                  <Copy className="w-3 h-3 text-rose-400" />
                  +{def.buffs.duplicateChance}% Clone
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Target Stepper & Replacement Toggle */}
        <div className="bg-slate-950 rounded-xl p-3 border-2 border-slate-800 mb-3 space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-pixel text-[9px] text-slate-300 flex items-center gap-1.5 uppercase">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Target Goals
            </span>

            {/* Retro pixel stepper */}
            <div className="inline-flex items-center bg-slate-900 border-2 border-slate-700 rounded-lg overflow-hidden shadow-pixel-sm">
              <button
                type="button"
                onClick={onDecrement}
                disabled={quantity <= 0}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent font-pixel text-xs active:translate-y-0.5 transition-transform"
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
                className="w-12 h-8 text-center bg-transparent font-pixel text-xs text-white focus:outline-none focus:bg-slate-800/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label={`${def.name} target quantity`}
              />

              <button
                type="button"
                onClick={onIncrement}
                className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 font-pixel text-xs active:translate-y-0.5 transition-transform"
                aria-label={`Increase ${def.name} target`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Keep Replacement Spawner Switch */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <div className="text-left">
              <label
                htmlFor={`keep-spawner-${def.id}`}
                className="text-xs font-semibold text-slate-200 cursor-pointer flex items-center gap-1 font-mono"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Keep +1 Replacement Spawner
              </label>
              <div className="text-[10px] text-slate-400 font-mono">
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
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out shadow-pixel-sm ${
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
        <div className="grid grid-cols-3 gap-2 text-center bg-slate-950/70 rounded-xl p-2.5 border-2 border-slate-800 mb-3 text-xs">
          <div>
            <div className="text-[9px] uppercase text-slate-400 font-pixel">Gross L5/L1</div>
            <div className="font-mono font-bold text-slate-200 mt-0.5">
              {grossL5Stations} L5 <span className="text-slate-400 font-normal">({grossL1Stations})</span>
            </div>
          </div>

          <div className="border-x-2 border-slate-800 px-1">
            <div className="text-[9px] uppercase text-slate-400 font-pixel">Owned Saved</div>
            <div className="font-mono font-bold text-emerald-400 mt-0.5">
              -{ownedL1Equivalent + (secondaryOwnedL1Equivalent || 0)} L1
            </div>
          </div>

          <div>
            <div className="text-[9px] uppercase text-slate-400 font-pixel">Net L1s</div>
            <div className="font-mono font-bold text-amber-300 mt-0.5 text-sm">
              {formatNumber(netL1StationsNeeded + (secondaryNetL1StationsNeeded || 0))}
            </div>
          </div>
        </div>

        {/* Runes Needed for this Legendary */}
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-wider font-pixel text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Runes Required:</span>
            {netL1StationsNeeded === 0 && quantity > 0 && (
              <span className="text-[9px] font-pixel text-emerald-400">
                COVERED!
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.keys(runesRequired).map((r) => {
              const rune = r as RuneType;
              const meta = RUNES[rune];
              const totalCost = runesRequired[rune] || 0;

              return (
                <div
                  key={rune}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border-2 shadow-pixel-sm flex-1 min-w-[120px] ${
                    isSelected ? meta.bgClass : 'bg-slate-950/70'
                  } ${meta.borderClass}`}
                >
                  <RuneIcon type={rune} size="sm" glow={isSelected && totalCost > 0} />
                  <div className="min-w-0">
                    <div className="text-[9px] text-slate-400 font-mono truncate">
                      {meta.name}
                    </div>
                    <div className={`font-mono font-bold text-xs sm:text-sm ${meta.textClass}`}>
                      {formatNumber(totalCost)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Collapsible Accordion: Subtract Owned Stations (L1-L5) */}
        <div className="mt-auto border-t-2 border-slate-800 pt-2.5">
          <button
            type="button"
            onClick={() => setIsOwnedExpanded(!isOwnedExpanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors py-1"
          >
            <span className="flex items-center gap-1.5 font-mono">
              <span>Subtract Owned Stations (L1–L5)</span>
              {ownedL1Equivalent > 0 && (
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                  {ownedL1Equivalent + (secondaryOwnedL1Equivalent || 0)} L1 Equiv
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
            <div className="mt-2.5 p-3 bg-slate-950 rounded-xl border-2 border-slate-800 space-y-2.5 animate-fadeIn">
              {/* Combination Legendary Station Tabs */}
              {def.isCombination && def.secondaryStationName && (
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 mb-2">
                  <button
                    type="button"
                    onClick={() => setActiveStationTab('primary')}
                    className={`flex-1 py-1 text-xs font-mono font-bold rounded ${
                      activeStationTab === 'primary'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {def.stationName} ({ownedL1Equivalent} L1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStationTab('secondary')}
                    className={`flex-1 py-1 text-xs font-mono font-bold rounded ${
                      activeStationTab === 'secondary'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {def.secondaryStationName} ({secondaryOwnedL1Equivalent || 0} L1)
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>
                  Enter existing{' '}
                  <strong className="text-slate-200">
                    {def.isCombination
                      ? activeStationTab === 'primary'
                        ? def.stationName
                        : def.secondaryStationName
                      : def.stationName}
                  </strong>{' '}
                  stations:
                </span>
                <button
                  type="button"
                  onClick={onClearOwnedStations}
                  className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors text-[10px]"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>

              {/* Station level offset inputs (L1 through L5) */}
              <div className="grid grid-cols-5 gap-1.5">
                {([1, 2, 3, 4, 5] as StationLevel[]).map((lvl) => {
                  const power = stationLevelToL1(lvl);
                  const isPrimary = activeStationTab === 'primary' || !def.isCombination;
                  const currentCount = isPrimary
                    ? ownedStations[lvl] || 0
                    : (secondaryOwnedStations && secondaryOwnedStations[lvl]) || 0;

                  return (
                    <div
                      key={lvl}
                      className="flex flex-col items-center bg-slate-900 border border-slate-700 rounded-lg p-1.5"
                    >
                      <span className="text-[9px] font-pixel text-slate-300">
                        L{lvl}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono mb-1">
                        ({power}L1)
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={currentCount === 0 ? '' : currentCount}
                        placeholder="0"
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          const count = isNaN(val) ? 0 : val;
                          if (isPrimary) {
                            onSetOwnedStation(lvl, count);
                          } else if (onSetSecondaryOwnedStation) {
                            onSetSecondaryOwnedStation(lvl, count);
                          }
                        }}
                        className="w-full text-center bg-slate-950 border border-slate-600 rounded py-1 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between font-mono">
                <span>Scaling: L1=1, L2=2, L3=4, L4=8, L5=16</span>
                <span className="text-emerald-400 font-bold">
                  Offset:{' '}
                  {def.isCombination
                    ? `${ownedL1Equivalent} ${def.stationName} + ${secondaryOwnedL1Equivalent || 0} ${def.secondaryStationName}`
                    : `${ownedL1Equivalent} L1`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
