export type RuneType =
  | 'ice'
  | 'poison'
  | 'blood'
  | 'moon'
  | 'death'
  | 'cosmic'
  | 'astro'
  | 'energy';

export type StationLevel = 1 | 2 | 3 | 4 | 5;

export type OwnedStations = Record<StationLevel, number>;

export type LegendaryId =
  | 'lich'
  | 'gorgon'
  | 'harpy'
  | 'reaper'
  | 'cyclops'
  | 'archdemon'
  | 'robo_chicken'
  | 'stalker'
  | 'shield_bot'
  | 'the_cursed'
  | 'the_colossus'
  | 'the_infernal';

export type LegendaryGroup = 'group1' | 'group2' | 'group3' | 'group4';

export interface LegendaryBuffs {
  timeShards: number;
  maxMana?: number;
  maxSlime?: number;
  maxDarkness?: number;
  shieldChance?: number; // Shield Bot
  resourceGen?: number;  // The Cursed
  combatFood?: boolean;  // The Colossus
  duplicateChance?: number; // The Infernal
}

export interface SecondaryStationDef {
  name: string;
  baseL1Cost: Partial<Record<RuneType, number>>;
}

export interface LegendaryDef {
  id: LegendaryId;
  name: string;
  stationName: string;
  secondaryStationName?: string;
  category: 'undead' | 'unholy' | 'eldritch' | 'alien' | 'fusion';
  group: LegendaryGroup;
  baseL1Cost: Partial<Record<RuneType, number>>;
  secondaryBaseL1Cost?: Partial<Record<RuneType, number>>;
  buffs: LegendaryBuffs;
  accentColor: string;
  glowColor: string;
  description: string;
  imageSrc: string;
  isCombination?: boolean;
  combinationRecipe?: string;
}

export interface LegendaryState {
  quantity: number;
  keepReplacement: boolean;
  ownedStations: OwnedStations;
  secondaryOwnedStations?: OwnedStations;
}

export type StashState = Record<RuneType, number>;

export interface LegendaryCalculationResult {
  quantity: number;
  keepReplacement: boolean;
  grossL5Stations: number;
  grossL1Stations: number;
  ownedL1Equivalent: number;
  secondaryOwnedL1Equivalent?: number;
  netL1StationsNeeded: number;
  secondaryNetL1StationsNeeded?: number;
  runesRequired: Partial<Record<RuneType, number>>;
  buffsGranted: {
    timeShards: number;
    maxMana: number;
    maxSlime: number;
    maxDarkness: number;
    shieldChance: number;
    resourceGen: number;
    duplicateChance: number;
  };
}

export interface GroupBonusResult {
  group: LegendaryGroup;
  name: string;
  isComplete: boolean;
  baseBonus: number;
  effectiveBonus: number;
  members: LegendaryId[];
  ownedMembers: LegendaryId[];
}

export interface TimeShardCalculatorState {
  devourerLevel: number;
  featTier: number;
  otherBoostPercent: number;
  groupUpgradeLevel: number; // The Hacker group multiplier upgrade level
}

export interface TimeShardCalculationResult {
  devourerLevel: number;
  baseShards: number;
  featTier: number;
  featBonusPercent: number;
  legendariesBonusPercent: number;
  groupsBonusPercent: number;
  otherBonusPercent: number;
  totalMultiplier: number;
  totalTimeShards: number;
  groups: GroupBonusResult[];
}

export interface AggregateCalculationResult {
  byLegendary: Record<LegendaryId, LegendaryCalculationResult>;
  totalRunesGross: Record<RuneType, number>;
  totalRunesDeficit: Record<RuneType, number>;
  totalRunesSurplus: Record<RuneType, number>;
  progressByRune: Record<RuneType, number>;
  totalBuffs: {
    timeShards: number;
    maxMana: number;
    maxSlime: number;
    maxDarkness: number;
    shieldChance: number;
    resourceGen: number;
    duplicateChance: number;
  };
  totalLegendariesCount: number;
  totalBaseStationsNeeded: number;
  isAllFulfilled: boolean;
  timeShardsEstimate: TimeShardCalculationResult;
}

export interface RuneInfo {
  type: RuneType;
  name: string;
  colorName: string;
  hex: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  accentGlow: string;
  lightBg: string;
  imageSrc: string;
}
