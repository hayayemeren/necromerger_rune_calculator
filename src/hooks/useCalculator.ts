import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  AggregateCalculationResult,
  LegendaryId,
  LegendaryState,
  RuneType,
  StashState,
  StationLevel,
} from '../types/game';
import {
  INITIAL_OWNED_STATIONS,
  INITIAL_STASH,
  LEGENDARIES,
  LEGENDARY_ORDER,
  RUNE_ORDER,
} from '../data/gameData';
import { calculateAggregate } from '../utils/calculator';
import { PresetDef } from '../data/presets';

const STORAGE_KEY_LEGENDARIES = 'necromerger_calc_legendaries_v2';
const STORAGE_KEY_STASH = 'necromerger_calc_stash_v2';
const STORAGE_KEY_GLOBAL_KEEP = 'necromerger_calc_global_keep_v2';

const createDefaultLegendaryStates = (): Record<LegendaryId, LegendaryState> => {
  const states = {} as Record<LegendaryId, LegendaryState>;
  for (const id of LEGENDARY_ORDER) {
    states[id] = {
      // Default to 1 Lich & 1 Gorgon for immediate useful demonstration
      quantity: id === 'lich' || id === 'gorgon' ? 1 : 0,
      keepReplacement: true,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
  }
  return states;
};

export function useCalculator() {
  const [legendaries, setLegendaries] = useLocalStorage<Record<LegendaryId, LegendaryState>>(
    STORAGE_KEY_LEGENDARIES,
    createDefaultLegendaryStates()
  );

  const [stash, setStash] = useLocalStorage<StashState>(
    STORAGE_KEY_STASH,
    { ...INITIAL_STASH }
  );

  const [globalKeepReplacement, setGlobalKeepReplacementState] = useLocalStorage<boolean>(
    STORAGE_KEY_GLOBAL_KEEP,
    true
  );

  // Set quantity for a legendary
  const setQuantity = useCallback((id: LegendaryId, quantity: number) => {
    const validQty = Math.max(0, Math.floor(quantity));
    setLegendaries((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        quantity: validQty,
      },
    }));
  }, [setLegendaries]);

  const incrementQuantity = useCallback((id: LegendaryId) => {
    setLegendaries((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        quantity: (prev[id]?.quantity || 0) + 1,
      },
    }));
  }, [setLegendaries]);

  const decrementQuantity = useCallback((id: LegendaryId) => {
    setLegendaries((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        quantity: Math.max(0, (prev[id]?.quantity || 0) - 1),
      },
    }));
  }, [setLegendaries]);

  // Set per-legendary replacement toggle
  const setKeepReplacement = useCallback((id: LegendaryId, keep: boolean) => {
    setLegendaries((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        keepReplacement: keep,
      },
    }));
  }, [setLegendaries]);

  // Global toggle to preserve replacement spawner across all legendaries
  const setGlobalKeepReplacement = useCallback((keep: boolean) => {
    setGlobalKeepReplacementState(keep);
    setLegendaries((prev) => {
      const updated = { ...prev };
      for (const id of LEGENDARY_ORDER) {
        if (updated[id]) {
          updated[id] = {
            ...updated[id],
            keepReplacement: keep,
          };
        }
      }
      return updated;
    });
  }, [setGlobalKeepReplacementState, setLegendaries]);

  // Set owned station count for a level
  const setOwnedStation = useCallback((id: LegendaryId, level: StationLevel, count: number) => {
    const validCount = Math.max(0, Math.floor(count));
    setLegendaries((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ownedStations: {
          ...prev[id].ownedStations,
          [level]: validCount,
        },
      },
    }));
  }, [setLegendaries]);

  // Clear owned stations for a specific legendary
  const clearOwnedStations = useCallback((id: LegendaryId) => {
    setLegendaries((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ownedStations: { ...INITIAL_OWNED_STATIONS },
      },
    }));
  }, [setLegendaries]);

  // Stash controls
  const setStashRune = useCallback((rune: RuneType, amount: number) => {
    const validAmount = Math.max(0, Math.floor(amount));
    setStash((prev) => ({
      ...prev,
      [rune]: validAmount,
    }));
  }, [setStash]);

  const adjustStashRune = useCallback((rune: RuneType, delta: number) => {
    setStash((prev) => ({
      ...prev,
      [rune]: Math.max(0, (prev[rune] || 0) + delta),
    }));
  }, [setStash]);

  const clearStash = useCallback(() => {
    setStash({ ...INITIAL_STASH });
  }, [setStash]);

  // Apply a preset configuration
  const applyPreset = useCallback((preset: PresetDef) => {
    setLegendaries((prev) => {
      const updated = { ...prev };
      for (const id of LEGENDARY_ORDER) {
        const targetQty = preset.targets[id] ?? 0;
        updated[id] = {
          ...updated[id],
          quantity: targetQty,
          keepReplacement: preset.keepReplacement,
        };
      }
      return updated;
    });
    setGlobalKeepReplacementState(preset.keepReplacement);
  }, [setLegendaries, setGlobalKeepReplacementState]);

  // Reset targets to 0
  const resetAllTargets = useCallback(() => {
    setLegendaries((prev) => {
      const updated = { ...prev };
      for (const id of LEGENDARY_ORDER) {
        updated[id] = {
          ...updated[id],
          quantity: 0,
        };
      }
      return updated;
    });
  }, [setLegendaries]);

  // Full factory reset (targets, owned stations, and stash)
  const resetFull = useCallback(() => {
    setLegendaries(createDefaultLegendaryStates());
    setStash({ ...INITIAL_STASH });
    setGlobalKeepReplacementState(true);
  }, [setLegendaries, setStash, setGlobalKeepReplacementState]);

  // Memoized aggregate results
  const aggregate: AggregateCalculationResult = useMemo(() => {
    return calculateAggregate(LEGENDARIES, legendaries, stash);
  }, [legendaries, stash]);

  // Quick helper to fill stash to match 100% of required runes (useful for testing or one-click planning)
  const fillStashToMatchRequired = useCallback(() => {
    setStash((prev) => {
      const nextStash = { ...prev };
      for (const rune of RUNE_ORDER) {
        nextStash[rune] = aggregate.totalRunesGross[rune] || 0;
      }
      return nextStash;
    });
  }, [aggregate.totalRunesGross, setStash]);

  return {
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
  };
}
