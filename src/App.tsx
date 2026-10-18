import React, { useState } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { LEGENDARIES, LEGENDARY_ORDER } from './data/gameData';
import { Header } from './components/Header';
import { LegendaryCard } from './components/LegendaryCard';
import { TimeMachineCalculator } from './components/TimeMachineCalculator';
import { RuneStashDrawer } from './components/RuneStashDrawer';
import { PresetSelector } from './components/PresetSelector';
import { GuideModal } from './components/GuideModal';
import { Coins, Filter, HelpCircle, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const {
    legendaries,
    stash,
    globalKeepReplacement,
    timeShardState,
    aggregate,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    setKeepReplacement,
    setGlobalKeepReplacement,
    setOwnedStation,
    setSecondaryOwnedStation,
    clearOwnedStations,
    setStashRune,
    adjustStashRune,
    clearStash,
    setDevourerLevel,
    setFeatTier,
    setOtherBoostPercent,
    setGroupUpgradeLevel,
    applyPreset,
    resetAllTargets,
    resetFull,
    fillStashToMatchRequired,
  } = useCalculator();

  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [isStashOpen, setIsStashOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Filter state for cards
  const [filterMode, setFilterMode] = useState<
    'all' | 'active' | 'undead' | 'unholy' | 'alien' | 'fusion'
  >('all');

  const filteredLegendaryIds = LEGENDARY_ORDER.filter((id) => {
    if (filterMode === 'active') {
      return (legendaries[id]?.quantity || 0) > 0;
    }
    if (filterMode === 'undead') {
      return LEGENDARIES[id].category === 'undead';
    }
    if (filterMode === 'unholy') {
      return LEGENDARIES[id].category === 'unholy';
    }
    if (filterMode === 'alien') {
      return LEGENDARIES[id].category === 'alien';
    }
    if (filterMode === 'fusion') {
      return LEGENDARIES[id].category === 'fusion';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Sticky Header with Live Cumulative Stats & Rune Summary */}
      <Header
        aggregate={aggregate}
        stash={stash}
        globalKeepReplacement={globalKeepReplacement}
        onToggleGlobalKeepReplacement={() => setGlobalKeepReplacement(!globalKeepReplacement)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenStash={() => setIsStashOpen(true)}
        onResetTargets={resetAllTargets}
        onResetFull={resetFull}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* NEW: Dedicated Time Machine & Prestige Shard Calculator */}
        <TimeMachineCalculator
          aggregate={aggregate}
          devourerLevel={timeShardState.devourerLevel}
          featTier={timeShardState.featTier}
          otherBoostPercent={timeShardState.otherBoostPercent}
          groupUpgradeLevel={timeShardState.groupUpgradeLevel}
          onSetDevourerLevel={setDevourerLevel}
          onSetFeatTier={setFeatTier}
          onSetOtherBoostPercent={setOtherBoostPercent}
          onSetGroupUpgradeLevel={setGroupUpgradeLevel}
        />

        {/* Controls Bar above cards: Filter & Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b-2 border-slate-800">
          <div>
            <h2 className="font-pixel text-xs sm:text-sm tracking-wide text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              SUMMONING GOALS & STATIONS ({filteredLegendaryIds.length})
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Includes Core, Alien Tech (Shield Bot), and Surgeon Fusions (Cursed, Colossus, Infernal)
            </p>
          </div>

          {/* Category / Active Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border-2 border-slate-800 text-xs shrink-0 self-start sm:self-auto overflow-x-auto max-w-full shadow-pixel-sm font-mono">
            <span className="text-[10px] uppercase text-slate-500 px-1 flex items-center gap-1 font-bold">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterMode === 'all'
                  ? 'bg-purple-600 text-white shadow-pixel-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All (12)
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('active')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterMode === 'active'
                  ? 'bg-purple-600 text-white shadow-pixel-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active ({aggregate.totalLegendariesCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('undead')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterMode === 'undead'
                  ? 'bg-purple-600 text-white shadow-pixel-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Undead
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('unholy')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterMode === 'unholy'
                  ? 'bg-purple-600 text-white shadow-pixel-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unholy
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('alien')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterMode === 'alien'
                  ? 'bg-purple-600 text-white shadow-pixel-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Alien / Tech
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('fusion')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                filterMode === 'fusion'
                  ? 'bg-purple-600 text-white shadow-pixel-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fusions
            </button>
          </div>
        </div>

        {/* Legendaries Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 sm:gap-6">
          {filteredLegendaryIds.map((id) => {
            const def = LEGENDARIES[id];
            const state = legendaries[id];
            const calc = aggregate.byLegendary[id];

            return (
              <LegendaryCard
                key={id}
                def={def}
                state={state}
                calculation={calc}
                onSetQuantity={(qty) => setQuantity(id, qty)}
                onIncrement={() => incrementQuantity(id)}
                onDecrement={() => decrementQuantity(id)}
                onToggleKeepReplacement={(keep) => setKeepReplacement(id, keep)}
                onSetOwnedStation={(lvl, count) => setOwnedStation(id, lvl, count)}
                onSetSecondaryOwnedStation={(lvl, count) =>
                  setSecondaryOwnedStation(id, lvl, count)
                }
                onClearOwnedStations={() => clearOwnedStations(id)}
              />
            );
          })}
        </div>

        {filteredLegendaryIds.length === 0 && (
          <div className="text-center py-16 bg-slate-900 border-2 border-slate-800 rounded-2xl shadow-pixel">
            <p className="text-slate-400 text-xs font-pixel">NO LEGENDARIES MATCH THIS FILTER</p>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className="mt-3 px-4 py-2 font-pixel text-[10px] bg-purple-600 text-white rounded-lg hover:bg-purple-500 shadow-pixel-sm transition-colors"
            >
              SHOW ALL (12)
            </button>
          </div>
        )}
      </main>

      {/* Floating Banked Runes Trigger (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          type="button"
          onClick={() => setIsStashOpen(true)}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-4 py-3 rounded-2xl shadow-pixel border-2 border-amber-400 hover:scale-105 active:scale-95 transition-all duration-150"
          title="Open Banked Runes Inventory"
        >
          <Coins className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
          <span className="font-pixel text-[10px] tracking-wider uppercase text-amber-100">
            RUNE STASH
          </span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t-2 border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            NecroMerger Pixel Calculator — Powered by official game sprites and formulas.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-purple-400 transition-colors flex items-center gap-1 font-pixel text-[9px]"
            >
              <HelpCircle className="w-3.5 h-3.5" /> HOW FUSING WORKS
            </button>
            <button
              type="button"
              onClick={() => setIsPresetsOpen(true)}
              className="hover:text-purple-400 transition-colors font-pixel text-[9px]"
            >
              PROGRESSION PRESETS
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <PresetSelector
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={applyPreset}
      />

      <RuneStashDrawer
        isOpen={isStashOpen}
        onClose={() => setIsStashOpen(false)}
        stash={stash}
        totalRunesGross={aggregate.totalRunesGross}
        totalRunesDeficit={aggregate.totalRunesDeficit}
        onSetStashRune={setStashRune}
        onAdjustStashRune={adjustStashRune}
        onClearStash={clearStash}
        onFillStashToMatchRequired={fillStashToMatchRequired}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};

export default App;
