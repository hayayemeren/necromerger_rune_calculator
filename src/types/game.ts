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
  | 'stalker';

export interface LegendaryBuffs {
  timeShards: number;
  maxMana?: number;
  maxSlime?: number;
  maxDarkness?: number;
}

export interface RuneCost {
  rune: RuneType;
  amount: number;
}

export interface LegendaryDef {
  id: LegendaryId;
  name: string;
  stationName: string;
  category: 'undead' | 'unholy' | 'eldritch' | 'alien';
  baseL1Cost: Partial<Record<RuneType, number>>;
  buffs: LegendaryBuffs;
  accentColor: string;
  glowColor: string;
  description: string;
}

export interface LegendaryState {
  quantity: number;
  keepReplacement: boolean;
  ownedStations: OwnedStations;
}

export type StashState = Record<RuneType, number>;

export interface CalculatorState {
  legendaries: Record<LegendaryId, LegendaryState>;
  stash: StashState;
  globalKeepReplacement: boolean;
}

export interface LegendaryCalculationResult {
  quantity: number;
  keepReplacement: boolean;
  grossL5Stations: number;
  grossL1Stations: number;
  ownedL1Equivalent: number;
  netL1StationsNeeded: number;
  netL5EquivalentNeeded: number;
  runesRequired: Partial<Record<RuneType, number>>;
  buffsGranted: {
    timeShards: number;
    maxMana: number;
    maxSlime: number;
    maxDarkness: number;
  };
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
  };
  totalLegendariesCount: number;
  totalBaseStationsNeeded: number;
  isAllFulfilled: boolean;
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
}
