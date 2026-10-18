import {
  AggregateCalculationResult,
  LegendaryCalculationResult,
  LegendaryDef,
  LegendaryId,
  LegendaryState,
  OwnedStations,
  RuneType,
  StashState,
  StationLevel,
} from '../types/game';
import { RUNE_ORDER } from '../data/gameData';

/**
 * Returns 2^(level - 1) base Level 1 stations equivalent.
 * L1 = 1, L2 = 2, L3 = 4, L4 = 8, L5 = 16.
 */
export function stationLevelToL1(level: StationLevel): number {
  return Math.pow(2, level - 1);
}

/**
 * Sums up all owned stations converted to Level 1 base station equivalents.
 */
export function calculateOwnedL1(owned: OwnedStations): number {
  let total = 0;
  for (let lvl = 1; lvl <= 5; lvl++) {
    const count = owned[lvl as StationLevel] || 0;
    total += count * stationLevelToL1(lvl as StationLevel);
  }
  return total;
}

/**
 * Decomposes an L1 count into the optimal combination of full L5, L4, L3, L2, L1 stations.
 */
export function decomposeL1ToStations(l1Count: number): Record<StationLevel, number> {
  let remaining = Math.max(0, l1Count);
  const result: Record<StationLevel, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  const levels: StationLevel[] = [5, 4, 3, 2, 1];
  for (const lvl of levels) {
    const power = stationLevelToL1(lvl);
    if (remaining >= power) {
      result[lvl] = Math.floor(remaining / power);
      remaining %= power;
    }
  }
  return result;
}

/**
 * Calculates station and rune requirements for a single legendary.
 */
export function calculateLegendaryResult(
  def: LegendaryDef,
  state: LegendaryState
): LegendaryCalculationResult {
  const quantity = Math.max(0, state.quantity);
  const keepReplacement = state.keepReplacement;

  if (quantity === 0) {
    return {
      quantity: 0,
      keepReplacement,
      grossL5Stations: 0,
      grossL1Stations: 0,
      ownedL1Equivalent: calculateOwnedL1(state.ownedStations),
      netL1StationsNeeded: 0,
      netL5EquivalentNeeded: 0,
      runesRequired: {},
      buffsGranted: {
        timeShards: 0,
        maxMana: 0,
        maxSlime: 0,
        maxDarkness: 0,
      },
    };
  }

  // Gross L5 needed: 2 per legendary + 1 replacement spawner if requested
  const grossL5Stations = keepReplacement ? 2 * quantity + 1 : 2 * quantity;
  // 1 L5 = 16 L1s
  const grossL1Stations = grossL5Stations * 16;

  const ownedL1Equivalent = calculateOwnedL1(state.ownedStations);
  const netL1StationsNeeded = Math.max(0, grossL1Stations - ownedL1Equivalent);
  const netL5EquivalentNeeded = Math.ceil(netL1StationsNeeded / 16);

  const runesRequired: Partial<Record<RuneType, number>> = {};
  for (const [rune, baseCost] of Object.entries(def.baseL1Cost) as [RuneType, number][]) {
    runesRequired[rune] = netL1StationsNeeded * baseCost;
  }

  const buffsGranted = {
    timeShards: (def.buffs.timeShards || 0) * quantity,
    maxMana: (def.buffs.maxMana || 0) * quantity,
    maxSlime: (def.buffs.maxSlime || 0) * quantity,
    maxDarkness: (def.buffs.maxDarkness || 0) * quantity,
  };

  return {
    quantity,
    keepReplacement,
    grossL5Stations,
    grossL1Stations,
    ownedL1Equivalent,
    netL1StationsNeeded,
    netL5EquivalentNeeded,
    runesRequired,
    buffsGranted,
  };
}

/**
 * Aggregates all legendaries, runes, stash deficits, and cumulative multipliers.
 */
export function calculateAggregate(
  definitions: Record<LegendaryId, LegendaryDef>,
  states: Record<LegendaryId, LegendaryState>,
  stash: StashState
): AggregateCalculationResult {
  const byLegendary = {} as Record<LegendaryId, LegendaryCalculationResult>;

  const totalRunesGross: Record<RuneType, number> = {
    ice: 0,
    poison: 0,
    blood: 0,
    moon: 0,
    death: 0,
    cosmic: 0,
    astro: 0,
    energy: 0,
  };

  const totalBuffs = {
    timeShards: 0,
    maxMana: 0,
    maxSlime: 0,
    maxDarkness: 0,
  };

  let totalLegendariesCount = 0;
  let totalBaseStationsNeeded = 0;

  for (const id of Object.keys(definitions) as LegendaryId[]) {
    const def = definitions[id];
    const state = states[id];
    const result = calculateLegendaryResult(def, state);
    byLegendary[id] = result;

    totalLegendariesCount += result.quantity;
    totalBaseStationsNeeded += result.netL1StationsNeeded;

    // Accumulate buffs
    totalBuffs.timeShards += result.buffsGranted.timeShards;
    totalBuffs.maxMana += result.buffsGranted.maxMana;
    totalBuffs.maxSlime += result.buffsGranted.maxSlime;
    totalBuffs.maxDarkness += result.buffsGranted.maxDarkness;

    // Accumulate runes
    for (const [rune, amt] of Object.entries(result.runesRequired) as [RuneType, number][]) {
      totalRunesGross[rune] += amt || 0;
    }
  }

  const totalRunesDeficit: Record<RuneType, number> = {
    ice: 0,
    poison: 0,
    blood: 0,
    moon: 0,
    death: 0,
    cosmic: 0,
    astro: 0,
    energy: 0,
  };

  const totalRunesSurplus: Record<RuneType, number> = {
    ice: 0,
    poison: 0,
    blood: 0,
    moon: 0,
    death: 0,
    cosmic: 0,
    astro: 0,
    energy: 0,
  };

  const progressByRune: Record<RuneType, number> = {
    ice: 0,
    poison: 0,
    blood: 0,
    moon: 0,
    death: 0,
    cosmic: 0,
    astro: 0,
    energy: 0,
  };

  let totalDeficitSum = 0;
  let hasAnyRequirement = false;

  for (const rune of RUNE_ORDER) {
    const gross = totalRunesGross[rune] || 0;
    const owned = Math.max(0, stash[rune] || 0);

    const deficit = Math.max(0, gross - owned);
    const surplus = Math.max(0, owned - gross);

    totalRunesDeficit[rune] = deficit;
    totalRunesSurplus[rune] = surplus;
    totalDeficitSum += deficit;

    if (gross > 0) {
      hasAnyRequirement = true;
      progressByRune[rune] = Math.min(100, Math.round((owned / gross) * 100));
    } else {
      progressByRune[rune] = 100;
    }
  }

  const isAllFulfilled = hasAnyRequirement && totalDeficitSum === 0;

  return {
    byLegendary,
    totalRunesGross,
    totalRunesDeficit,
    totalRunesSurplus,
    progressByRune,
    totalBuffs,
    totalLegendariesCount,
    totalBaseStationsNeeded,
    isAllFulfilled,
  };
}

/**
 * Format numbers with comma separators for clean presentation.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
