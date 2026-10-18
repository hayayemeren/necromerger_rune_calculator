import { LegendaryId } from '../types/game';

export interface PresetDef {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  targets: Partial<Record<LegendaryId, number>>;
  keepReplacement: boolean;
  description: string;
}

export const PRESETS: PresetDef[] = [
  {
    id: 'clear',
    name: 'Reset Targets',
    subtitle: 'Zero out all legendary goals',
    badge: 'Empty',
    targets: {
      lich: 0,
      gorgon: 0,
      harpy: 0,
      reaper: 0,
      cyclops: 0,
      archdemon: 0,
      robo_chicken: 0,
      stalker: 0,
    },
    keepReplacement: true,
    description: 'Resets all target counters to 0 while keeping your stashed runes and owned stations.',
  },
  {
    id: 'first_prestige',
    name: 'First Prestige',
    subtitle: 'Standard early restart milestone',
    badge: 'Beginner',
    targets: {
      lich: 1,
      gorgon: 1,
      harpy: 0,
      reaper: 0,
      cyclops: 0,
      archdemon: 0,
      robo_chicken: 0,
      stalker: 0,
    },
    keepReplacement: true,
    description: 'Lich + Gorgon with replacement spawners preserved. Ideal for early level cap resets.',
  },
  {
    id: 'trio_early',
    name: 'Unholy Trio',
    subtitle: 'Lich, Gorgon & Harpy',
    badge: 'Core',
    targets: {
      lich: 1,
      gorgon: 1,
      harpy: 1,
      reaper: 0,
      cyclops: 0,
      archdemon: 0,
      robo_chicken: 0,
      stalker: 0,
    },
    keepReplacement: true,
    description: 'All three early legendaries granting +15% Time Shards and +10% across Mana, Slime, and Darkness.',
  },
  {
    id: 'feat_16',
    name: 'Feat 16 Milestone',
    subtitle: 'Reaper & Cyclops unlock',
    badge: 'Mid-Game',
    targets: {
      lich: 1,
      gorgon: 1,
      harpy: 1,
      reaper: 1,
      cyclops: 1,
      archdemon: 0,
      robo_chicken: 0,
      stalker: 0,
    },
    keepReplacement: true,
    description: 'Adds Reaper (Lectern) and Cyclops (Fridge) requiring high quantities of Moon runes.',
  },
  {
    id: 'tier1_archdemon',
    name: 'Feat 21 / Archdemon',
    subtitle: 'Complete Tier 1 & Tier 2 pantheon',
    badge: 'Advanced',
    targets: {
      lich: 1,
      gorgon: 1,
      harpy: 1,
      reaper: 1,
      cyclops: 1,
      archdemon: 1,
      robo_chicken: 0,
      stalker: 0,
    },
    keepReplacement: true,
    description: 'Full unholy summoning circle including the formidable +20% Time Shard Archdemon.',
  },
  {
    id: 'full_pantheon',
    name: 'All 8 Legendaries',
    subtitle: '1 of each Legendary creature',
    badge: 'Complete',
    targets: {
      lich: 1,
      gorgon: 1,
      harpy: 1,
      reaper: 1,
      cyclops: 1,
      archdemon: 1,
      robo_chicken: 1,
      stalker: 1,
    },
    keepReplacement: true,
    description: 'One of each legendary including Robo-Chicken and Stalker. Grants massive +90% Time Shards total.',
  },
  {
    id: 'time_shard_farm',
    name: 'Time Shard Stacking',
    subtitle: 'Multi-legendary prestige farm',
    badge: 'Endgame',
    targets: {
      lich: 3,
      gorgon: 2,
      harpy: 2,
      reaper: 2,
      cyclops: 2,
      archdemon: 2,
      robo_chicken: 3,
      stalker: 2,
    },
    keepReplacement: false,
    description: 'Optimized mass-legendary farming target right before activating the Time Machine prestige.',
  },
];
