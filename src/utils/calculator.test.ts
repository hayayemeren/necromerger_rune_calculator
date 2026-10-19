import { describe, it, expect } from 'vitest';
import {
  stationLevelToL1,
  calculateOwnedL1,
  calculateLegendaryResult,
  calculateAggregate,
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

describe('Canonical Legendaries & True Station Rune Costs', () => {
  it('calculates Lich (2x L5 Grave = 32 L1 @ 20 Ice = 640 Ice)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.lich, state);
    expect(result.grossL1Stations).toBe(32);
    expect(result.runesRequired.ice).toBe(640);
    expect(result.buffsGranted.timeShards).toBe(10);
    expect(result.buffsGranted.maxMana).toBe(10);
  });

  it('calculates Reaper (2x L5 Lectern = 32 L1 @ 50 Ice + 20 Moon = 1,600 Ice + 640 Moon)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.reaper, state);
    expect(result.grossL1Stations).toBe(32);
    expect(result.runesRequired.ice).toBe(1600);
    expect(result.runesRequired.moon).toBe(640);
    expect(result.buffsGranted.timeShards).toBe(20);
  });

  it('calculates Cyclops (2x L5 Fridge = 32 L1 @ 50 Poison + 20 Moon = 1,600 Poison + 640 Moon)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.cyclops, state);
    expect(result.runesRequired.poison).toBe(1600);
    expect(result.runesRequired.moon).toBe(640);
    expect(result.buffsGranted.timeShards).toBe(20);
  });

  it('calculates Archdemon (2x L5 Portal = 32 L1 @ 30 Blood + 30 Death = 960 Blood + 960 Death)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.archdemon, state);
    expect(result.runesRequired.blood).toBe(960);
    expect(result.runesRequired.death).toBe(960);
    expect(result.buffsGranted.timeShards).toBe(20);
  });

  it('calculates Robo-Chicken (2x L5 Foul Chicken = 32 L1 @ 30 Ice + 15 Poison = 960 Ice + 480 Poison)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.robo_chicken, state);
    expect(result.runesRequired.ice).toBe(960);
    expect(result.runesRequired.poison).toBe(480);
    expect(result.buffsGranted.timeShards).toBe(20);
  });

  it('calculates Shield Bot (2x L5 Crashed Saucer = 32 L1 @ 20 Cosmic = 640 Cosmic)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.shield_bot, state);
    expect(result.runesRequired.cosmic).toBe(640);
    expect(result.buffsGranted.timeShards).toBe(30);
    expect(result.buffsGranted.shieldChance).toBe(10);
  });

  it('calculates Soul Stalker (2x L2 Soul Grinder = 4 L1 @ 200 Death + 200 Cosmic = 800 Death + 800 Cosmic)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.stalker, state);
    expect(result.grossL1Stations).toBe(4);
    expect(result.runesRequired.death).toBe(800);
    expect(result.runesRequired.cosmic).toBe(800);
    expect(result.buffsGranted.timeShards).toBe(40);
  });

  it('calculates The Cursed combination fusion (1x Lich + 1x Reaper = 2,240 Ice + 640 Moon)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
      secondaryOwnedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.the_cursed, state);
    // Primary Grave: 32 * 20 = 640 Ice
    // Secondary Lectern: 32 * 50 Ice + 32 * 20 Moon = 1600 Ice + 640 Moon
    // Total Ice: 640 + 1600 = 2240 Ice
    expect(result.runesRequired.ice).toBe(2240);
    expect(result.runesRequired.moon).toBe(640);
    expect(result.buffsGranted.timeShards).toBe(40);
    expect(result.buffsGranted.resourceGen).toBe(20);
  });

  it('calculates The Colossus (1x Gorgon + 1x Cyclops = 2,240 Poison + 640 Moon)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
      secondaryOwnedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.the_colossus, state);
    expect(result.runesRequired.poison).toBe(2240);
    expect(result.runesRequired.moon).toBe(640);
    expect(result.buffsGranted.timeShards).toBe(40);
  });

  it('calculates The Infernal (1x Harpy + 1x Archdemon = 1,600 Blood + 960 Death)', () => {
    const state: LegendaryState = {
      quantity: 1,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
      secondaryOwnedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.the_infernal, state);
    expect(result.runesRequired.blood).toBe(1600);
    expect(result.runesRequired.death).toBe(960);
    expect(result.buffsGranted.timeShards).toBe(40);
    expect(result.buffsGranted.duplicateChance).toBe(5);
  });

  it('calculates duplicate legendary shard buffs (1st full, dupes half)', () => {
    const state: LegendaryState = {
      quantity: 3, // 1st gives 10%, next two give 5% each -> 10 + 5 + 5 = 20%
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    };
    const result = calculateLegendaryResult(LEGENDARIES.lich, state);
    expect(result.buffsGranted.timeShards).toBe(20);

    // Shield bot: 1st gives 30%, 2nd gives 15% -> 45%
    const shieldBotResult = calculateLegendaryResult(LEGENDARIES.shield_bot, {
      quantity: 2,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    });
    expect(shieldBotResult.buffsGranted.timeShards).toBe(45);

    // Soul stalker: 1st gives 40%, 2nd gives 20% -> 60%
    const stalkerResult = calculateLegendaryResult(LEGENDARIES.stalker, {
      quantity: 2,
      keepReplacement: false,
      ownedStations: { ...INITIAL_OWNED_STATIONS },
    });
    expect(stalkerResult.buffsGranted.timeShards).toBe(60);
  });

  it('verifies canonical maxQuantity caps in game data', () => {
    expect(LEGENDARIES.archdemon.maxQuantity).toBe(4);
    expect(LEGENDARIES.robo_chicken.maxQuantity).toBe(4);
    expect(LEGENDARIES.shield_bot.maxQuantity).toBe(4);
    expect(LEGENDARIES.the_cursed.maxQuantity).toBe(1);
    expect(LEGENDARIES.the_colossus.maxQuantity).toBe(1);
    expect(LEGENDARIES.the_infernal.maxQuantity).toBe(1);
    expect(LEGENDARIES.lich.maxQuantity).toBeUndefined();
  });
});

describe('Devourer Base Shards & Time Machine Calculations', () => {
  it('correctly maps Devourer levels to base shards up to level 1000', () => {
    expect(getDevourerBaseShards(30)).toBe(0); // Under 35
    expect(getDevourerBaseShards(35)).toBe(150);
    expect(getDevourerBaseShards(50)).toBe(750);
    expect(getDevourerBaseShards(100)).toBe(15000);
    expect(getDevourerBaseShards(150)).toBe(40000);
    expect(getDevourerBaseShards(200)).toBe(65000);
    expect(getDevourerBaseShards(250)).toBe(107000);
    expect(getDevourerBaseShards(300)).toBe(150000);
    expect(getDevourerBaseShards(400)).toBe(275000);
    expect(getDevourerBaseShards(500)).toBe(450000);
    expect(getDevourerBaseShards(600)).toBe(700000);
    expect(getDevourerBaseShards(700)).toBe(1000000);
    expect(getDevourerBaseShards(800)).toBe(1500000);
    expect(getDevourerBaseShards(900)).toBe(2200000);
    expect(getDevourerBaseShards(1000)).toBe(3200000);
  });

  it('evaluates Feat multipliers with 100% base + 10% per completed feat (Feat 29 = 390%)', () => {
    const result = calculateTimeShards(
      {
        devourerLevel: 100, // 15000 base
        featTier: 29,       // 100 + 29*10 = 390% (3.9x)
        otherBoostPercent: 0,
        groupUpgradeLevel: 0,
      },
      0,
      {} as Record<LegendaryId, number>
    );
    expect(result.baseShards).toBe(15000);
    expect(result.featBonusPercent).toBe(390);
    // 15000 * 3.9 = 58500
    expect(result.totalTimeShards).toBe(58500);
  });

  it('triggers Legendary Group completion with canonical Group bonuses (20%, 40%, 60%, 80%)', () => {
    const activeLegendaries: Record<LegendaryId, number> = {
      lich: 0,
      gorgon: 0,
      harpy: 0,
      reaper: 1,
      cyclops: 1,
      archdemon: 1,
      robo_chicken: 1,
      stalker: 1,
      shield_bot: 1,
      the_cursed: 1,
      the_colossus: 1,
      the_infernal: 1,
    };

    const res = calculateTimeShards(
      {
        devourerLevel: 70, // 3250 base
        featTier: 19,      // 100 + 190 = 290% (2.9x)
        otherBoostPercent: 0,
        groupUpgradeLevel: 0,
      },
      0,
      activeLegendaries
    );

    const g2 = res.groups.find((g) => g.group === 'group2')!;
    const g3 = res.groups.find((g) => g.group === 'group3')!;
    const g4 = res.groups.find((g) => g.group === 'group4')!;
    const g1 = res.groups.find((g) => g.group === 'group1')!;

    expect(g1.isComplete).toBe(false);
    expect(g1.effectiveBonus).toBe(0);

    expect(g2.isComplete).toBe(true);
    expect(g2.effectiveBonus).toBe(40);

    expect(g3.isComplete).toBe(true);
    expect(g3.effectiveBonus).toBe(60);

    expect(g4.isComplete).toBe(true);
    expect(g4.effectiveBonus).toBe(80);

    expect(res.groupsBonusPercent).toBe(40 + 60 + 80);
  });

  it('calculates Hacker group upgrade scaling correctly based on completed matching sets', () => {
    // Scenario 1: 3 Lich, 3 Gorgon, 3 Harpy with Group Upgrade 2 -> 60% boost
    const activeSetsOf3: Record<LegendaryId, number> = {
      lich: 3,
      gorgon: 3,
      harpy: 3,
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

    const res3Sets = calculateTimeShards(
      {
        devourerLevel: 50,
        featTier: 0,
        otherBoostPercent: 0,
        groupUpgradeLevel: 2, // allows up to 1 + 2 = 3 claimed sets
      },
      0,
      activeSetsOf3
    );

    const g1_3sets = res3Sets.groups.find((g) => g.group === 'group1')!;
    expect(g1_3sets.completeSets).toBe(3);
    expect(g1_3sets.claimedSets).toBe(3);
    expect(g1_3sets.effectiveBonus).toBe(60); // 3 * 20% = 60%
    expect(res3Sets.groupsBonusPercent).toBe(60);

    // Scenario 2: 2 Lich, 3 Gorgon, 3 Harpy with Group Upgrade 2 -> 40% boost
    const activeSetsOf2: Record<LegendaryId, number> = {
      lich: 2,
      gorgon: 3,
      harpy: 3,
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

    const res2Sets = calculateTimeShards(
      {
        devourerLevel: 50,
        featTier: 0,
        otherBoostPercent: 0,
        groupUpgradeLevel: 2,
      },
      0,
      activeSetsOf2
    );

    const g1_2sets = res2Sets.groups.find((g) => g.group === 'group1')!;
    expect(g1_2sets.completeSets).toBe(2); // limited by lich = 2
    expect(g1_2sets.claimedSets).toBe(2);
    expect(g1_2sets.effectiveBonus).toBe(40); // 2 * 20% = 40%
    expect(res2Sets.groupsBonusPercent).toBe(40);

    // Scenario 3: 4 Lich, 4 Gorgon, 4 Harpy with Group Upgrade 0 -> 20% boost (capped at 1 set)
    const resUnupgraded = calculateTimeShards(
      {
        devourerLevel: 50,
        featTier: 0,
        otherBoostPercent: 0,
        groupUpgradeLevel: 0, // only 1 set can be claimed
      },
      0,
      { ...activeSetsOf3, lich: 4, gorgon: 4, harpy: 4 }
    );
    const g1_capped = resUnupgraded.groups.find((g) => g.group === 'group1')!;
    expect(g1_capped.completeSets).toBe(4);
    expect(g1_capped.claimedSets).toBe(1);
    expect(g1_capped.effectiveBonus).toBe(20);
  });

  it('matches user exact formula scenario: Level 389 (261,250), Feat 29 (390%), 575% Legendaries & Sets, Other 240%', () => {
    // 4 Archdemon, 4 Robo, 4 Shield, 1 Stalker, 1 Cursed, 1 Colossus, 1 Infernal
    const activeLegendaries: Record<LegendaryId, number> = {
      lich: 0,
      gorgon: 0,
      harpy: 0,
      reaper: 0,
      cyclops: 0,
      archdemon: 4,    // 20 + 3*10 = 50%
      robo_chicken: 4, // 20 + 3*10 = 50%
      shield_bot: 4,   // 30 + 3*15 = 75%
      stalker: 1,      // 40%
      the_cursed: 1,   // 40%
      the_colossus: 1, // 40%
      the_infernal: 1, // 40%
    };
    // Sum of individual: 50 + 50 + 75 + 40 + 40 + 40 + 40 = 335%
    // Group 3 (Robo, Stalker, Shield): 1 set = 60%
    // Group 4 (Cursed, Colossus, Infernal): 1 set = 80%
    // Total groups: 140%
    // Base 100% + 335% + 140% = 575% (5.75x)

    const res = calculateTimeShards(
      {
        devourerLevel: 389, // Base: 261,250
        featTier: 29,       // 100 + 29*10 = 390% (3.9x)
        otherBoostPercent: 240, // 240% (2.4x)
        groupUpgradeLevel: 0,
      },
      335,
      activeLegendaries
    );

    expect(res.baseShards).toBe(261250);
    expect(res.featBonusPercent).toBe(390);
    expect(res.legendariesBonusPercent).toBe(335);
    expect(res.groupsBonusPercent).toBe(140);
    expect(res.totalLegendariesAndGroupsPercent).toBe(575);
    expect(res.otherBonusPercent).toBe(240);

    // Multiplier = 3.9 * 5.75 * 2.4 = 53.82
    expect(res.totalMultiplier).toBeCloseTo(53.82, 4);

    // Total shards = 261250 * 53.82 = 14,060,475 (definitely not the buggy 19,919,006!)
    expect(res.totalTimeShards).toBe(14060475);
  });

  it('verifies minions in lair contribute to Time Shards & Groups WITHOUT increasing required runes', () => {
    const states = {} as Record<LegendaryId, LegendaryState>;
    for (const id of Object.keys(LEGENDARIES) as LegendaryId[]) {
      states[id] = {
        quantity: 0, // 0 to craft
        keepReplacement: true,
        ownedStations: { ...INITIAL_OWNED_STATIONS },
      };
    }

    const lairLegendaries: Record<LegendaryId, number> = {
      lich: 0,
      gorgon: 0,
      harpy: 0,
      reaper: 0,
      cyclops: 0,
      archdemon: 4,
      robo_chicken: 4,
      shield_bot: 4,
      stalker: 1,
      the_cursed: 1,
      the_colossus: 1,
      the_infernal: 1,
    };

    const agg = calculateAggregate(
      LEGENDARIES,
      states,
      { ice: 0, poison: 0, blood: 0, moon: 0, death: 0, cosmic: 0, astro: 0, energy: 0 },
      {
        devourerLevel: 389,
        featTier: 29,
        otherBoostPercent: 240,
        groupUpgradeLevel: 0,
      },
      lairLegendaries
    );

    // Runes required must be 0 for all runes because minions are already in the lair!
    for (const val of Object.values(agg.totalRunesGross)) {
      expect(val).toBe(0);
    }
    expect(agg.totalBaseStationsNeeded).toBe(0);
    expect(agg.totalLegendariesCount).toBe(0); // 0 to craft
    expect(agg.totalLairLegendariesCount).toBe(16); // 16 in lair
    expect(agg.totalBoardLegendariesCount).toBe(16);

    // Buffs must be fully active
    expect(agg.totalBuffs.timeShards).toBe(335);
    expect(agg.timeShardsEstimate.totalLegendariesAndGroupsPercent).toBe(575);
    expect(agg.timeShardsEstimate.totalTimeShards).toBe(14060475);
  });
});

