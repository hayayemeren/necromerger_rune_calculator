import {
  AggregateCalculationResult,
  GroupBonusResult,
  LegendaryCalculationResult,
  LegendaryDef,
  LegendaryGroup,
  LegendaryId,
  LegendaryState,
  OwnedStations,
  RuneType,
  StashState,
  StationLevel,
  TimeShardCalculationResult,
  TimeShardCalculatorState,
} from '../types/game';
import {
  DEVOURER_BASE_SHARDS_TABLE,
  INITIAL_OWNED_STATIONS,
  LEGENDARY_GROUPS,
  RUNE_ORDER,
} from '../data/gameData';

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
 * Supports standard legendaries, Soul Stalker (Tier 2 Soul Grinder), and dual-station combination legendaries.
 */
export function calculateLegendaryResult(
  def: LegendaryDef,
  state: LegendaryState,
  lairQuantity: number = 0
): LegendaryCalculationResult {
  const quantity = Math.max(0, state.quantity); // Target to craft
  const lairQty = Math.max(0, lairQuantity); // Already in lair (costs 0 runes)
  const totalBoardQuantity = quantity + lairQty;
  const keepReplacement = state.keepReplacement;

  let grossL5Stations = 0;
  let grossL1Stations = 0;
  const ownedL1Equivalent = calculateOwnedL1(state.ownedStations);
  const secondaryOwnedL1Equivalent = def.isCombination
    ? calculateOwnedL1(state.secondaryOwnedStations || INITIAL_OWNED_STATIONS)
    : undefined;
  let netL1StationsNeeded = 0;
  let secondaryNetL1StationsNeeded = def.isCombination ? 0 : undefined;
  const runesRequired: Partial<Record<RuneType, number>> = {};

  // Station and rune calculations are strictly for minions to craft (quantity)
  if (quantity > 0) {
    const reqStationLevel = def.requiredStationLevel || 5;
    const l1PerStation = stationLevelToL1(reqStationLevel);

    // Gross stations needed: 2 per legendary + 1 replacement spawner if requested
    grossL5Stations = keepReplacement ? 2 * quantity + 1 : 2 * quantity;
    grossL1Stations = grossL5Stations * l1PerStation;
    netL1StationsNeeded = Math.max(0, grossL1Stations - ownedL1Equivalent);

    // Primary Station Runes
    for (const [rune, baseCost] of Object.entries(def.baseL1Cost) as [RuneType, number][]) {
      runesRequired[rune] = (runesRequired[rune] || 0) + netL1StationsNeeded * baseCost;
    }

    // Secondary Station Runes (if Combination Legendary like The Cursed, The Colossus, The Infernal)
    if (def.isCombination && def.secondaryBaseL1Cost) {
      const secondaryGrossL1Stations = grossL5Stations * 16;
      secondaryNetL1StationsNeeded = Math.max(
        0,
        secondaryGrossL1Stations - (secondaryOwnedL1Equivalent || 0)
      );

      for (const [rune, baseCost] of Object.entries(def.secondaryBaseL1Cost) as [
        RuneType,
        number,
      ][]) {
        runesRequired[rune] =
          (runesRequired[rune] || 0) + secondaryNetL1StationsNeeded * baseCost;
      }
    }
  }

  // Buffs are calculated based on total minions on board at prestige: totalBoardQuantity
  const timeShardBonus =
    totalBoardQuantity === 0
      ? 0
      : def.buffs.subsequentTimeShards !== undefined && totalBoardQuantity > 1
      ? def.buffs.timeShards + (totalBoardQuantity - 1) * def.buffs.subsequentTimeShards
      : (def.buffs.timeShards || 0) * totalBoardQuantity;

  const buffsGranted = {
    timeShards: timeShardBonus,
    maxMana: (def.buffs.maxMana || 0) * totalBoardQuantity,
    maxSlime: (def.buffs.maxSlime || 0) * totalBoardQuantity,
    maxDarkness: (def.buffs.maxDarkness || 0) * totalBoardQuantity,
    shieldChance: (def.buffs.shieldChance || 0) * totalBoardQuantity,
    resourceGen: (def.buffs.resourceGen || 0) * totalBoardQuantity,
    duplicateChance: (def.buffs.duplicateChance || 0) * totalBoardQuantity,
  };

  return {
    quantity,
    lairQuantity: lairQty,
    totalBoardQuantity,
    keepReplacement,
    grossL5Stations,
    grossL1Stations,
    ownedL1Equivalent,
    secondaryOwnedL1Equivalent,
    netL1StationsNeeded,
    secondaryNetL1StationsNeeded,
    runesRequired,
    buffsGranted,
  };
}

/**
 * Interpolates base Time Shards from Devourer Level (35 up to 1000).
 */
export function getDevourerBaseShards(level: number): number {
  if (level < 35) return 0;

  const milestones = Object.keys(DEVOURER_BASE_SHARDS_TABLE)
    .map(Number)
    .sort((a, b) => a - b);

  const minLevel = milestones[0];
  const maxLevel = milestones[milestones.length - 1]; // 1000

  if (level <= minLevel) {
    return DEVOURER_BASE_SHARDS_TABLE[minLevel];
  }

  if (level >= maxLevel) {
    return DEVOURER_BASE_SHARDS_TABLE[maxLevel];
  }

  // Find surrounding milestones and interpolate linearly
  for (let i = 0; i < milestones.length - 1; i++) {
    const low = milestones[i];
    const high = milestones[i + 1];
    if (level >= low && level <= high) {
      const lowVal = DEVOURER_BASE_SHARDS_TABLE[low];
      const highVal = DEVOURER_BASE_SHARDS_TABLE[high];
      const fraction = (level - low) / (high - low);
      return Math.round(lowVal + fraction * (highVal - lowVal));
    }
  }

  return DEVOURER_BASE_SHARDS_TABLE[maxLevel];
}

/**
 * Calculates Time Shards based on Devourer level, Feat tier, Legendaries, Groups, and Other boosts.
 * Feat boost has a base of 100% and increases by +10% for every completed feat (e.g. 29 feats = 390% -> 3.9x).
 * Legendaries and Sets starts with base 100%, and added legendaries + groups come on top of it.
 * Other multiplier is the total percentage from the game (e.g. 240% -> 2.4x).
 */
export function calculateTimeShards(
  timeShardState: TimeShardCalculatorState,
  legendariesBonusPercent: number,
  activeLegendaries: Record<LegendaryId, number>
): TimeShardCalculationResult {
  const devourerLevel = Math.max(1, Math.min(1000, Math.floor(timeShardState.devourerLevel)));
  const baseShards = getDevourerBaseShards(devourerLevel);

  // Base is 100%, and each completed Feat gives +10% (e.g. 29 completed feats = 100 + 29*10 = 390% -> 3.9x multiplier)
  const featTier = Math.max(0, Math.min(50, Math.floor(timeShardState.featTier)));
  const featBonusPercent = 100 + featTier * 10;
  const featMult = featBonusPercent / 100;

  // Evaluate Legendary Groups
  const groupResults: GroupBonusResult[] = [];
  let totalGroupsBonus = 0;
  const upgradeLevel = Math.max(0, Math.floor(timeShardState.groupUpgradeLevel));

  for (const [groupId, groupDef] of Object.entries(LEGENDARY_GROUPS) as [
    LegendaryGroup,
    { name: string; baseBonus: number; members: LegendaryId[] },
  ][]) {
    const ownedMembers = groupDef.members.filter((m) => (activeLegendaries[m] || 0) > 0);
    const memberCounts = groupDef.members.map((m) => activeLegendaries[m] || 0);
    const completeSets = Math.min(...memberCounts);
    const isComplete = completeSets > 0;

    // Upgrades allow claiming multiple completed sets: up to (1 + upgradeLevel) sets
    const maxClaimableSets = 1 + upgradeLevel;
    const claimedSets = isComplete ? Math.min(completeSets, maxClaimableSets) : 0;
    const effectiveBonus = claimedSets * groupDef.baseBonus;

    if (claimedSets > 0) {
      totalGroupsBonus += effectiveBonus;
    }

    groupResults.push({
      group: groupId,
      name: groupDef.name,
      isComplete,
      completeSets,
      claimedSets,
      baseBonus: groupDef.baseBonus,
      effectiveBonus,
      members: groupDef.members,
      ownedMembers,
    });
  }

  // Legendaries and sets starts with 100 percent base, and added legendaries come on top of it:
  // e.g. 100% + 335% (individual) + 140% (groups) = 575% -> 5.75x multiplier
  const totalLegendariesAndGroupsPercent = 100 + legendariesBonusPercent + totalGroupsBonus;
  const legAndGroupMult = totalLegendariesAndGroupsPercent / 100;

  // Other: Total Other % from the game's Time Machine screen (e.g. 240% -> 2.4x)
  // If <= 0, default to baseline 100% (1.0x)
  const rawOther = timeShardState.otherBoostPercent;
  const otherPercent = rawOther && rawOther > 0 ? rawOther : 100;
  const otherMult = otherPercent / 100;

  // Multiplicative formula across categories:
  // Base * (Feats% / 100) * (Legendaries & Sets% / 100) * (Other% / 100)
  const totalMultiplier = featMult * legAndGroupMult * otherMult;
  const totalTimeShards = Math.floor(baseShards * totalMultiplier);

  return {
    devourerLevel,
    baseShards,
    featTier,
    featBonusPercent,
    legendariesBonusPercent,
    groupsBonusPercent: totalGroupsBonus,
    totalLegendariesAndGroupsPercent,
    otherBonusPercent: otherPercent,
    totalMultiplier,
    totalTimeShards,
    groups: groupResults,
  };
}

/**
 * Aggregates all legendaries, runes, stash deficits, and cumulative multipliers.
 */
export function calculateAggregate(
  definitions: Record<LegendaryId, LegendaryDef>,
  states: Record<LegendaryId, LegendaryState>,
  stash: StashState,
  timeShardState: TimeShardCalculatorState,
  lairLegendaries: Record<LegendaryId, number> = {} as Record<LegendaryId, number>
): AggregateCalculationResult {
  const byLegendary = {} as Record<LegendaryId, LegendaryCalculationResult>;
  const activeLegendaryCounts = {} as Record<LegendaryId, number>;

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
    shieldChance: 0,
    resourceGen: 0,
    duplicateChance: 0,
  };

  let totalLegendariesCount = 0;
  let totalLairLegendariesCount = 0;
  let totalBoardLegendariesCount = 0;
  let totalBaseStationsNeeded = 0;

  for (const id of Object.keys(definitions) as LegendaryId[]) {
    const def = definitions[id];
    const state = states[id];
    const lairQty = lairLegendaries[id] || 0;
    const result = calculateLegendaryResult(def, state, lairQty);
    byLegendary[id] = result;
    activeLegendaryCounts[id] = result.totalBoardQuantity;

    totalLegendariesCount += result.quantity;
    totalLairLegendariesCount += lairQty;
    totalBoardLegendariesCount += result.totalBoardQuantity;
    totalBaseStationsNeeded +=
      result.netL1StationsNeeded + (result.secondaryNetL1StationsNeeded || 0);

    // Accumulate buffs (from total minions on board)
    totalBuffs.timeShards += result.buffsGranted.timeShards;
    totalBuffs.maxMana += result.buffsGranted.maxMana;
    totalBuffs.maxSlime += result.buffsGranted.maxSlime;
    totalBuffs.maxDarkness += result.buffsGranted.maxDarkness;
    totalBuffs.shieldChance += result.buffsGranted.shieldChance;
    totalBuffs.resourceGen += result.buffsGranted.resourceGen;
    totalBuffs.duplicateChance += result.buffsGranted.duplicateChance;

    // Accumulate runes (only for minions to craft)
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

  // Calculate full Time Shard projections
  const timeShardsEstimate = calculateTimeShards(
    timeShardState,
    totalBuffs.timeShards,
    activeLegendaryCounts
  );

  return {
    byLegendary,
    totalRunesGross,
    totalRunesDeficit,
    totalRunesSurplus,
    progressByRune,
    totalBuffs,
    totalLegendariesCount,
    totalLairLegendariesCount,
    totalBoardLegendariesCount,
    totalBaseStationsNeeded,
    isAllFulfilled,
    timeShardsEstimate,
  };
}

/**
 * Format numbers with comma separators for clean presentation.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
