import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  AggregateCalculationResult,
  LegendaryId,
  LegendaryState,
  RuneType,
  StashState,
  StationLevel,
  TimeShardCalculatorState,
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

const STORAGE_KEY_LEGENDARIES = 'necromerger_calc_legendaries_v3';
const STORAGE_KEY_STASH = 'necromerger_calc_stash_v3';
const STORAGE_KEY_GLOBAL_KEEP = 'necromerger_calc_global_keep_v3';
const STORAGE_KEY_TIME_SHARD = 'necromerger_calc_timeshard_v3';

const createDefaultLegendaryStates = (): Record<LegendaryId, LegendaryState> => {
  const states = {} as Record<LegendaryId, LegendaryState>;
  for (const id of LEGENDARY_ORDER) {
    states[id] = {
      quantity: id === 'lich' || id === 'gorgon' ? 1 : 0,
      keepReplacement: true,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
      secondaryOwnedStations: LEGENDARIES[id]?.isCombination
        ? { ...INITIAL_OWNED_STATIONS }
        : undefined,
    };
  }
  return states;
};

const defaultTimeShardState: TimeShardCalculatorState = {
  devourerLevel: 40,
  featTier: 12,
  otherBoostPercent: 0,
  groupUpgradeLevel: 0,
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

  const [timeShardState, setTimeShardState] = useLocalStorage<TimeShardCalculatorState>(
    STORAGE_KEY_TIME_SHARD,
    defaultTimeShardState
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

  // Set owned station count for primary station
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

  // Set owned station count for secondary station (combination legendaries)
  const setSecondaryOwnedStation = useCallback(
    (id: LegendaryId, level: StationLevel, count: number) => {
      const validCount = Math.max(0, Math.floor(count));
      setLegendaries((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          secondaryOwnedStations: {
            ...(prev[id].secondaryOwnedStations || INITIAL_OWNED_STATIONS),
            [level]: validCount,
          },
        },
      }));
    },
    [setLegendaries]
  );

  // Clear owned stations for a specific legendary
  const clearOwnedStations = useCallback((id: LegendaryId) => {
    setLegendaries((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ownedStations: { ...INITIAL_OWNED_STATIONS },
        secondaryOwnedStations: prev[id].secondaryOwnedStations
          ? { ...INITIAL_OWNED_STATIONS }
          : undefined,
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

  // Time Shard Calculator state controls
  const setDevourerLevel = useCallback((level: number) => {
    setTimeShardState((prev) => ({
      ...prev,
      devourerLevel: Math.max(1, Math.min(100, Math.floor(level))),
    }));
  }, [setTimeShardState]);

  const setFeatTier = useCallback((tier: number) => {
    setTimeShardState((prev) => ({
      ...prev,
      featTier: Math.max(0, Math.min(22, Math.floor(tier))),
    }));
  }, [setTimeShardState]);

  const setOtherBoostPercent = useCallback((boost: number) => {
    setTimeShardState((prev) => ({
      ...prev,
      otherBoostPercent: Math.max(0, Math.floor(boost)),
    }));
  }, [setTimeShardState]);

  const setGroupUpgradeLevel = useCallback((level: number) => {
    setTimeShardState((prev) => ({
      ...prev,
      groupUpgradeLevel: Math.max(0, Math.floor(level)),
    }));
  }, [setTimeShardState]);

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

  // Full factory reset
  const resetFull = useCallback(() => {
    setLegendaries(createDefaultLegendaryStates());
    setStash({ ...INITIAL_STASH });
    setGlobalKeepReplacementState(true);
    setTimeShardState(defaultTimeShardState);
  }, [setLegendaries, setStash, setGlobalKeepReplacementState, setTimeShardState]);

  // Memoized aggregate results
  const aggregate: AggregateCalculationResult = useMemo(() => {
    return calculateAggregate(LEGENDARIES, legendaries, stash, timeShardState);
  }, [legendaries, stash, timeShardState]);

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
  };
}
