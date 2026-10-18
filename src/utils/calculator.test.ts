import { describe, it, expect } from 'vitest';
import {
  stationLevelToL1,
  calculateOwnedL1,
  calculateLegendaryResult,
  calculateAggregate,
  decomposeL1ToStations,
} from './calculator';
import { LEGENDARIES, INITIAL_OWNED_STATIONS, INITIAL_STASH } from '../data/gameData';
import { LegendaryId, LegendaryState } from '../types/game';

describe('Station Math & Powers of 2', () => {
  it('correctly maps station levels to 2^(level - 1)', () => {
    expect(stationLevelToL1(1)).toBe(1);
    expect(stationLevelToL1(2)).toBe(2);
    expect(stationLevelToL1(3)).toBe(4);
    expect(stationLevelToL1(4)).toBe(8);
    expect(stationLevelToL1(5)).toBe(16);
  });

  it('calculates owned station equivalents properly', () => {
    // 2x L1 (2) + 1x L2 (2) + 1x L3 (4) + 1x L4 (8) + 1x L5 (16) = 32
    const owned = {
      1: 2,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
    };
    expect(calculateOwnedL1(owned)).toBe(32);
  });

  it('correctly decomposes L1 count into stations', () => {
    // 48 L1 = 3x L5
    expect(decomposeL1ToStations(48)).toEqual({ 5: 3, 4: 0, 3: 0, 2: 0, 1: 0 });
    // 31 L1 = 1x L5 (16) + 1x L4 (8) + 1x L3 (4) + 1x L2 (2) + 1x L1 (1)
    expect(decomposeL1ToStations(31)).toEqual({ 5: 1, 4: 1, 3: 1, 2: 1, 1: 1 });
  });
});

describe('Single Legendary Calculation', () => {
  it('returns 0 for quantity 0', () => {
    const state: LegendaryState = {
      quantity: 0,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.lich, state);
    expect(result.grossL5Stations).toBe(0);
    expect(result.grossL1Stations).toBe(0);
    expect(result.netL1StationsNeeded).toBe(0);
    expect(result.runesRequired).toEqual({});
  });

  it('calculates 1 Lich without replacement (2x L5 = 32 L1 base stations, 640 Ice Runes)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.lich, state);
    expect(result.grossL5Stations).toBe(2);
    expect(result.grossL1Stations).toBe(32);
    expect(result.netL1StationsNeeded).toBe(32);
    // 32 * 20 = 640 Ice Runes
    expect(result.runesRequired.ice).toBe(640);
    expect(result.buffsGranted.timeShards).toBe(5);
    expect(result.buffsGranted.maxMana).toBe(10);
  });

  it('calculates 1 Lich with replacement spawner (3x L5 = 48 L1 base stations, 960 Ice Runes)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: true,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.lich, state);
    expect(result.grossL5Stations).toBe(3);
    expect(result.grossL1Stations).toBe(48);
    expect(result.netL1StationsNeeded).toBe(48);
    // 48 * 20 = 960 Ice Runes
    expect(result.runesRequired.ice).toBe(960);
  });

  it('applies owned stations offset correctly and never drops below 0', () => {
    // Need 48 L1, own 1x L5 (16) and 1x L4 (8) = 24 owned
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: true,
      ownedStations: {
        1: 0,
        2: 0,
        3: 0,
        4: 1, // 8
        5: 1, // 16
      },
    };
    const result = calculateLegendaryResult(LEGENDARIES.lich, state);
    expect(result.grossL1Stations).toBe(48);
    expect(result.ownedL1Equivalent).toBe(24);
    expect(result.netL1StationsNeeded).toBe(24);
    // 24 * 20 = 480 Ice Runes
    expect(result.runesRequired.ice).toBe(480);

    // If owned exceeds required
    const surplusState: LegendaryState = {
      quantity: 1,
      keepReplacement: false, // Gross 32
      ownedStations: {
        ...INITIAL_OWNED_STATIONS,
        5: 3, // 3 * 16 = 48 owned
      },
    };
    const surplusResult = calculateLegendaryResult(LEGENDARIES.lich, surplusState);
    expect(surplusResult.grossL1Stations).toBe(32);
    expect(surplusResult.ownedL1Equivalent).toBe(48);
    expect(surplusResult.netL1StationsNeeded).toBe(0);
    expect(surplusResult.runesRequired.ice).toBe(0);
  });

  it('calculates dual-rune costs for Reaper (Moon + Ice)', () => {
    // Reaper: 20 Moon + 10 Ice per L1 Lectern
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.reaper, state);
    expect(result.grossL1Stations).toBe(32);
    // 32 * 20 = 640 Moon Runes
    expect(result.runesRequired.moon).toBe(640);
    // 32 * 10 = 320 Ice Runes
    expect(result.runesRequired.ice).toBe(320);
    expect(result.buffsGranted.timeShards).toBe(10);
    expect(result.buffsGranted.maxMana).toBe(10);
  });

  it('calculates dual-rune costs for Stalker (25 Astro + 10 Energy)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.stalker, state);
    expect(result.grossL1Stations).toBe(32);
    // 32 * 25 = 800 Astro
    expect(result.runesRequired.astro).toBe(800);
    // 32 * 10 = 320 Energy
    expect(result.runesRequired.energy).toBe(320);
    expect(result.buffsGranted.timeShards).toBe(25);
  });
});

describe('Aggregate Calculation & Stash Deficits', () => {
  it('correctly aggregates multiple legendaries and calculates deficit against stash', () => {
    const defaultStates = {} as Record<LegendaryId, LegendaryState>;
    for (const key of Object.keys(LEGENDARIES) as LegendaryId[]) {
      defaultStates[key] = {
        quantity: 0,
        keepReplacement: true,
        ownedStations: { ...INITIAL_OWNED_STATIONS },
      };
    }

    // Target 1 Lich (48 L1 @ 20 Ice = 960 Ice) and 1 Reaper (48 L1 @ 20 Moon + 10 Ice = 960 Moon + 480 Ice)
    defaultStates.lich.quantity = 1;
    defaultStates.reaper.quantity = 1;

    // Stash: 1000 Ice, 500 Moon
    const stash = {
      ...INITIAL_STASH,
      ice: 1000,
      moon: 500,
    };

    const agg = calculateAggregate(LEGENDARIES, defaultStates, stash);

    // Ice required = 960 (Lich) + 480 (Reaper) = 1440
    expect(agg.totalRunesGross.ice).toBe(1440);
    // Ice owned = 1000 => Deficit = 1440 - 1000 = 440
    expect(agg.totalRunesDeficit.ice).toBe(440);
    expect(agg.totalRunesSurplus.ice).toBe(0);

    // Moon required = 960
    expect(agg.totalRunesGross.moon).toBe(960);
    // Moon owned = 500 => Deficit = 960 - 500 = 460
    expect(agg.totalRunesDeficit.moon).toBe(460);

    // Buffs: Lich (+5% shards, +10% mana) + Reaper (+10% shards, +10% mana)
    expect(agg.totalBuffs.timeShards).toBe(15);
    expect(agg.totalBuffs.maxMana).toBe(20);
    expect(agg.totalLegendariesCount).toBe(2);
    expect(agg.isAllFulfilled).toBe(false);
  });

  it('marks isAllFulfilled true when stash covers all required runes', () => {
    const states = {} as Record<LegendaryId, LegendaryState>;
    for (const key of Object.keys(LEGENDARIES) as LegendaryId[]) {
      states[key] = {
        quantity: key === 'gorgon' ? 1 : 0,
        keepReplacement: false,
        ownedStations: { ...INITIAL_OWNED_STATIONS },
      };
    }

    // 1 Gorgon without replacement = 32 L1 @ 20 Poison = 640 Poison Runes
    const stash = {
      ...INITIAL_STASH,
      poison: 700,
    };

    const agg = calculateAggregate(LEGENDARIES, states, stash);
    expect(agg.totalRunesGross.poison).toBe(640);
    expect(agg.totalRunesDeficit.poison).toBe(0);
    expect(agg.totalRunesSurplus.poison).toBe(60);
    expect(agg.progressByRune.poison).toBe(100);
    expect(agg.isAllFulfilled).toBe(true);
  });
});
