import React, { useState } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { LEGENDARIES, LEGENDARY_ORDER } from './data/gameData';
import { Header } from './components/Header';
import { LegendaryCard } from './components/LegendaryCard';
import { RuneStashDrawer } from './components/RuneStashDrawer';
import { PresetSelector } from './components/PresetSelector';
import { GuideModal } from './components/GuideModal';
import { Coins, Filter, HelpCircle, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const {
    legendaries,
    stash,
    globalKeepReplacement,
    aggregate,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    setKeepReplacement,
    setGlobalKeepReplacement,
    setOwnedStation,
    clearOwnedStations,
    setStashRune,
    adjustStashRune,
    clearStash,
    applyPreset,
    resetAllTargets,
    resetFull,
    fillStashToMatchRequired,
  } = useCalculator();

  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [isStashOpen, setIsStashOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Filter state for cards: all | active | category
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'undead' | 'unholy' | 'alien'>('all');

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
      return LEGENDARIES[id].category === 'alien' || LEGENDARIES[id].category === 'eldritch';
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
        {/* Controls Bar above cards: Filter & Quick Helper */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl font-bold font-serif tracking-wide text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Summoning Goals & Stations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure target quantities, replacement spawner safety buffers, and owned station credits
            </p>
          </div>

          {/* Category / Active Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
            <span className="text-[10px] uppercase font-mono text-slate-500 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All (8)
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('active')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterMode === 'active'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Goals ({aggregate.totalLegendariesCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('undead')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterMode === 'undead'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Undead
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('unholy')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterMode === 'unholy'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unholy
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('alien')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterMode === 'alien'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Alien / Eldritch
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
                onClearOwnedStations={() => clearOwnedStations(id)}
              />
            );
          })}
        </div>

        {filteredLegendaryIds.length === 0 && (
          <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800/80">
            <p className="text-slate-400 text-sm">No legendaries match the current filter.</p>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className="mt-3 px-4 py-1.5 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
            >
              Show All Legendaries
            </button>
          </div>
        )}
      </main>

      {/* Floating Banked Runes Trigger (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          type="button"
          onClick={() => setIsStashOpen(true)}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-4 py-3 rounded-full shadow-2xl border border-amber-400/40 hover:scale-105 active:scale-95 transition-all duration-200"
          title="Open Banked Runes Inventory"
        >
          <Coins className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold tracking-wider uppercase font-mono">
            Rune Stash
          </span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800 bg-slate-950/90 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            NecroMerger Legendary & Rune Calculator — Built for NecroMerger players.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-purple-400 transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" /> How Fusing Works
            </button>
            <button
              type="button"
              onClick={() => setIsPresetsOpen(true)}
              className="hover:text-purple-400 transition-colors"
            >
              Progression Presets
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
