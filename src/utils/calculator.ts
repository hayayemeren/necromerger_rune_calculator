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
 * Supports standard legendaries and dual-station combination legendaries.
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
      secondaryOwnedL1Equivalent: def.isCombination
        ? calculateOwnedL1(state.secondaryOwnedStations || INITIAL_OWNED_STATIONS)
        : undefined,
      netL1StationsNeeded: 0,
      secondaryNetL1StationsNeeded: def.isCombination ? 0 : undefined,
      runesRequired: {},
      buffsGranted: {
        timeShards: 0,
        maxMana: 0,
        maxSlime: 0,
        maxDarkness: 0,
        shieldChance: 0,
        resourceGen: 0,
        duplicateChance: 0,
      },
    };
  }

  // Gross L5 needed: 2 per legendary + 1 replacement spawner if requested
  const grossL5Stations = keepReplacement ? 2 * quantity + 1 : 2 * quantity;
  const grossL1Stations = grossL5Stations * 16;

  const ownedL1Equivalent = calculateOwnedL1(state.ownedStations);
  const netL1StationsNeeded = Math.max(0, grossL1Stations - ownedL1Equivalent);

  const runesRequired: Partial<Record<RuneType, number>> = {};

  // Primary Station Runes
  for (const [rune, baseCost] of Object.entries(def.baseL1Cost) as [RuneType, number][]) {
    runesRequired[rune] = (runesRequired[rune] || 0) + netL1StationsNeeded * baseCost;
  }

  // Secondary Station Runes (if Combination Legendary like The Cursed, The Colossus, The Infernal)
  let secondaryOwnedL1Equivalent: number | undefined;
  let secondaryNetL1StationsNeeded: number | undefined;

  if (def.isCombination && def.secondaryBaseL1Cost) {
    secondaryOwnedL1Equivalent = calculateOwnedL1(
      state.secondaryOwnedStations || INITIAL_OWNED_STATIONS
    );
    secondaryNetL1StationsNeeded = Math.max(0, grossL1Stations - secondaryOwnedL1Equivalent);

    for (const [rune, baseCost] of Object.entries(def.secondaryBaseL1Cost) as [
      RuneType,
      number,
    ][]) {
      runesRequired[rune] =
        (runesRequired[rune] || 0) + secondaryNetL1StationsNeeded * baseCost;
    }
  }

  const buffsGranted = {
    timeShards: (def.buffs.timeShards || 0) * quantity,
    maxMana: (def.buffs.maxMana || 0) * quantity,
    maxSlime: (def.buffs.maxSlime || 0) * quantity,
    maxDarkness: (def.buffs.maxDarkness || 0) * quantity,
    shieldChance: (def.buffs.shieldChance || 0) * quantity,
    resourceGen: (def.buffs.resourceGen || 0) * quantity,
    duplicateChance: (def.buffs.duplicateChance || 0) * quantity,
  };

  return {
    quantity,
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
 * Interpolates base Time Shards from Devourer Level (35 to 100).
 */
export function getDevourerBaseShards(level: number): number {
  if (level < 35) return 0;
  if (level >= 100) return 15000;

  const milestones = [35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
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
  return 15000;
}

/**
 * Calculates Time Shards based on Devourer level, Feat tier, Legendaries, Groups, and Other boosts.
 */
export function calculateTimeShards(
  timeShardState: TimeShardCalculatorState,
  legendariesBonusPercent: number,
  activeLegendaries: Record<LegendaryId, number>
): TimeShardCalculationResult {
  const devourerLevel = Math.max(1, Math.min(100, Math.floor(timeShardState.devourerLevel)));
  const baseShards = getDevourerBaseShards(devourerLevel);

  const featTier = Math.max(0, Math.min(22, Math.floor(timeShardState.featTier)));
  // Each completed Feat tier gives +10%
  const featBonusPercent = featTier * 10;

  // Evaluate Legendary Groups
  const groupResults: GroupBonusResult[] = [];
  let totalGroupsBonus = 0;
  const upgradeLevel = Math.max(0, Math.floor(timeShardState.groupUpgradeLevel));

  for (const [groupId, groupDef] of Object.entries(LEGENDARY_GROUPS) as [
    LegendaryGroup,
    { name: string; baseBonus: number; members: LegendaryId[] },
  ][]) {
    const ownedMembers = groupDef.members.filter((m) => (activeLegendaries[m] || 0) > 0);
    const isComplete = ownedMembers.length === groupDef.members.length;

    // Upgrades scale group bonus: base * (1 + upgradeLevel)
    const effectiveBonus = isComplete ? groupDef.baseBonus * (1 + upgradeLevel) : 0;

    if (isComplete) {
      totalGroupsBonus += effectiveBonus;
    }

    groupResults.push({
      group: groupId,
      name: groupDef.name,
      isComplete,
      baseBonus: groupDef.baseBonus,
      effectiveBonus,
      members: groupDef.members,
      ownedMembers,
    });
  }

  const otherBonusPercent = Math.max(0, timeShardState.otherBoostPercent);

  // Multiplicative formula across categories:
  // Base * (1 + Feats%) * (1 + (Legendaries% + Groups%)) * (1 + Other%)
  const featMult = 1 + featBonusPercent / 100;
  const legAndGroupMult = 1 + (legendariesBonusPercent + totalGroupsBonus) / 100;
  const otherMult = 1 + otherBonusPercent / 100;

  const totalMultiplier = featMult * legAndGroupMult * otherMult;
  const totalTimeShards = Math.floor(baseShards * totalMultiplier);

  return {
    devourerLevel,
    baseShards,
    featTier,
    featBonusPercent,
    legendariesBonusPercent,
    groupsBonusPercent: totalGroupsBonus,
    otherBonusPercent,
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
  timeShardState: TimeShardCalculatorState
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
  let totalBaseStationsNeeded = 0;

  for (const id of Object.keys(definitions) as LegendaryId[]) {
    const def = definitions[id];
    const state = states[id];
    const result = calculateLegendaryResult(def, state);
    byLegendary[id] = result;
    activeLegendaryCounts[id] = result.quantity;

    totalLegendariesCount += result.quantity;
    totalBaseStationsNeeded +=
      result.netL1StationsNeeded + (result.secondaryNetL1StationsNeeded || 0);

    // Accumulate buffs
    totalBuffs.timeShards += result.buffsGranted.timeShards;
    totalBuffs.maxMana += result.buffsGranted.maxMana;
    totalBuffs.maxSlime += result.buffsGranted.maxSlime;
    totalBuffs.maxDarkness += result.buffsGranted.maxDarkness;
    totalBuffs.shieldChance += result.buffsGranted.shieldChance;
    totalBuffs.resourceGen += result.buffsGranted.resourceGen;
    totalBuffs.duplicateChance += result.buffsGranted.duplicateChance;

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
