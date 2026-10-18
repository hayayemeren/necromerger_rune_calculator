import { describe, it, expect } from 'vitest';
import {
  stationLevelToL1,
  calculateOwnedL1,
  calculateLegendaryResult,
  decomposeL1ToStations,
  getDevourerBaseShards,
  calculateTimeShards,
} from './calculator';
import { LEGENDARIES, INITIAL_OWNED_STATIONS } from '../data/gameData';
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
    expect(decomposeL1ToStations(48)).toEqual({ 5: 3, 4: 0, 3: 0, 2: 0, 1: 0 });
    expect(decomposeL1ToStations(31)).toEqual({ 5: 1, 4: 1, 3: 1, 2: 1, 1: 1 });
  });
});

describe('New Legendaries: Shield Bot & Surgeon Fusions', () => {
  it('calculates Shield Bot (2x L5 Crashed Saucer = 32 L1 @ 20 Cosmic + 10 Astro)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.shield_bot, state);
    expect(result.grossL1Stations).toBe(32);
    // 32 * 20 = 640 Cosmic Runes
    expect(result.runesRequired.cosmic).toBe(640);
    // 32 * 10 = 320 Astro Runes
    expect(result.runesRequired.astro).toBe(320);
    expect(result.buffsGranted.timeShards).toBe(30);
    expect(result.buffsGranted.shieldChance).toBe(10);
  });

  it('calculates The Cursed combination fusion (Grave: 20 Ice + Lectern: 20 Moon, 10 Ice)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
      secondaryOwnedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.the_cursed, state);
    expect(result.grossL1Stations).toBe(32);
    // Primary Grave: 32 * 20 = 640 Ice
    // Secondary Lectern: 32 * 10 Ice + 32 * 20 Moon = 320 Ice + 640 Moon
    // Total Ice: 640 + 320 = 960 Ice
    expect(result.runesRequired.ice).toBe(960);
    expect(result.runesRequired.moon).toBe(640);
    expect(result.buffsGranted.timeShards).toBe(30);
    expect(result.buffsGranted.resourceGen).toBe(20);
  });

  it('calculates The Colossus (Cupboard: 20 Poison + Fridge: 20 Moon, 10 Poison)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
      secondaryOwnedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.the_colossus, state);
    // Total Poison: (32 * 20) + (32 * 10) = 640 + 320 = 960 Poison
    expect(result.runesRequired.poison).toBe(960);
    // Total Moon: 32 * 20 = 640 Moon
    expect(result.runesRequired.moon).toBe(640);
    expect(result.buffsGranted.timeShards).toBe(30);
  });

  it('calculates The Infernal (Altar: 20 Blood + Portal: 20 Death, 10 Blood)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
      secondaryOwnedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.the_infernal, state);
    // Total Blood: (32 * 20) + (32 * 10) = 960 Blood
    expect(result.runesRequired.blood).toBe(960);
    // Total Death: 32 * 20 = 640 Death
    expect(result.runesRequired.death).toBe(640);
    expect(result.buffsGranted.timeShards).toBe(30);
    expect(result.buffsGranted.duplicateChance).toBe(5);
  });
});

describe('Devourer Base Shards & Time Machine Calculations', () => {
  it('correctly maps Devourer levels to base shards', () => {
    expect(getDevourerBaseShards(30)).toBe(0); // Under 35
    expect(getDevourerBaseShards(35)).toBe(150);
    expect(getDevourerBaseShards(40)).toBe(275);
    expect(getDevourerBaseShards(60)).toBe(1500);
    expect(getDevourerBaseShards(100)).toBe(15000);
  });

  it('evaluates Feat multipliers (+10% per tier)', () => {
    const result = calculateTimeShards(
      {
        devourerLevel: 40, // 275 base
        featTier: 10,       // +100% (2.0x)
        otherBoostPercent: 0,
        groupUpgradeLevel: 0,
      },
      0,
      {} as Record<LegendaryId, number>
    );
    expect(result.baseShards).toBe(275);
    expect(result.featBonusPercent).toBe(100);
    // 275 * 2.0 = 550
    expect(result.totalTimeShards).toBe(550);
  });

  it('triggers Legendary Group completion and scales with Hacker group upgrades', () => {
    // Group 1 complete: Lich, Gorgon, Harpy (Base bonus = +20%)
    const activeLegendaries: Record<LegendaryId, number> = {
      lich: 1,
      gorgon: 1,
      harpy: 1,
      reaper: 0,
      cyclops: 0,
      archdemon: 0,
      robo_chicken: 0,
      stalker: 0,
      shield_bot: 0,
      the_cursed: 0,
      the_colossus: 0,
      the_infernal: 0,
    };

    // Level 0 upgrade (1x claim)
    const resLvl0 = calculateTimeShards(
      {
        devourerLevel: 60, // 1500 base
        featTier: 15,       // +150% (2.5x)
        otherBoostPercent: 0,
        groupUpgradeLevel: 0,
      },
      15, // +15% from 3 legendaries (+5% each)
      activeLegendaries
    );
    expect(resLvl0.groups.find((g) => g.group === 'group1')?.isComplete).toBe(true);
    expect(resLvl0.groupsBonusPercent).toBe(20);

    // Level 1 upgrade: 20% * (1 + 1) = +40% group bonus
    const resLvl1 = calculateTimeShards(
      {
        devourerLevel: 60,
        featTier: 15,
        otherBoostPercent: 0,
        groupUpgradeLevel: 1,
      },
      15,
      activeLegendaries
    );
    expect(resLvl1.groupsBonusPercent).toBe(40);
  });
});
