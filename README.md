# NecroMerger Legendary & Rune Calculator 💀🔮

A complete, production-ready web application for calculating station requirements, rune costs, banked stash deficits, and cumulative stat multipliers in **NecroMerger**. Built with **React 18**, **TypeScript** (strictly typed without `any`), and **Tailwind CSS** (Vite setup). Features authentic pixel-art styling, official game sprites, and canonical prestige math.

---

## ✨ Key Features

### 1. Canonical Fusing & Station Math
- **Station Level Scaling:** Binary progression ($2^{\text{Level}-1}$):
  - L1 = $1$ base station
  - L2 = $2$ base stations
  - L3 = $4$ base stations
  - L4 = $8$ base stations
  - L5 = $16$ base stations
- **Standard Fusion:** Consumes **2× Level 5 stations** = 32 Level 1 base stations (or 2× L2 Soul Grinder = 4 L1 base for Soul Stalker).
- **"Keep a Replacement Spawner" Feature:** Toggle per-legendary and globally to build **3× Level 5 stations** instead of 2 (48 Level 1 stations). Guarantees you keep one functional Level 5 spawner in your lair after the merge ritual.
- **Owned Station Offsets (L1–L5):** Expandable section under each legendary to enter existing stations on your board or crate. Each owned station reduces required Level 1 count by $2^{\text{Level}-1}$.
- **Non-negative Floor:** Net required base stations cannot drop below zero.

### 2. In Lair (Active Minions) System
- **0 Rune Cost:** Enter minions already active in your lair. They cost zero runes and stations to craft.
- **Full Buff Contributions:** Minions in the lair actively provide their Time Shard multipliers, resource caps, clone chances, and count toward completing Legendary Sets!
- **Board Cap Enforcement:** Real-time enforcement prevents exceeding in-game limits (e.g., max 4 Archdemons, 4 Robo-Chickens, 4 Shield Bots, 1 The Cursed, 1 The Colossus, 1 The Infernal).

### 3. Live Rune Aggregation & Stash Deficit Tracker
- Computes gross runes required across all active goals based on canonical base L1 purchase costs.
- **Banked Runes / Inventory Drawer:** Quick-access drawer to input banked runes with `+20`, `+100`, `+500`, and "Match All Needed" one-click autofill.
- **Live Deficit Calculation:** $\text{Deficit} = \max(0, \text{Gross Required} - \text{Stash})$.
- Displays progress bars and completion badges (Ready / Deficit) across all 8 rune types: Ice, Poison, Blood, Moon, Death, Cosmic, Astro, and Energy.

### 4. Canonical Game Data (`gameData.ts`)

| Legendary | Category | Group | Station(s) / Recipe | Base L1 Cost | Buffs (1st / Dupes) | Board Cap |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Lich** | Undead | Group 1 | 2× L5 Grave | 20 Ice | +10% / +5% Shards, +10% Max Mana | Unlimited |
| **Gorgon** | Unholy | Group 1 | 2× L5 Cupboard | 20 Poison | +10% / +5% Shards, +10% Max Slime | Unlimited |
| **Harpy** | Unholy | Group 1 | 2× L5 Altar | 20 Blood | +10% / +5% Shards, +10% Max Darkness | Unlimited |
| **Reaper** | Undead | Group 2 | 2× L5 Lectern | 50 Ice + 20 Moon | +20% / +10% Shards, +10% Max Mana | Unlimited |
| **Cyclops** | Unholy | Group 2 | 2× L5 Fridge | 50 Poison + 20 Moon | +20% / +10% Shards, +10% Max Slime | Unlimited |
| **Archdemon** | Eldritch | Group 2 | 2× L5 Portal | 30 Blood + 30 Death | +20% / +10% Shards, +10% Max Darkness | **Max 4** |
| **Robo-Chicken** | Alien | Group 3 | 2× L5 Foul Chicken | 30 Ice + 15 Poison | +20% / +10% Shards | **Max 4** |
| **Shield Bot** | Alien | Group 3 | 2× L5 Crashed Saucer | 20 Cosmic | +30% / +15% Shards, +10% Shield Chance | **Max 4** |
| **Soul Stalker** | Alien | Group 3 | 2× L2 Soul Grinder | 200 Death + 200 Cosmic | +40% / +20% Shards | Unlimited |
| **The Cursed** | Fusion | Group 4 | 1× Lich + 1× Reaper | 2,240 Ice + 640 Moon | +40% Shards, +20% All Resource Gen | **Max 1** |
| **The Colossus** | Fusion | Group 4 | 1× Gorgon + 1× Cyclops | 2,240 Poison + 640 Moon | +40% Shards, Combat Food Spawns | **Max 1** |
| **The Infernal** | Fusion | Group 4 | 1× Harpy + 1× Archdemon | 1,600 Blood + 960 Death | +40% Shards, +5% Merge Duplicate Chance | **Max 1** |

---

### 5. Time Machine & Prestige Shard Calculator

$$\text{Total Time Shards} = \text{Base}(\text{Devourer Level}) \times \frac{\text{Feats}\%}{100} \times \frac{\text{Legendaries \& Sets}\%}{100} \times \frac{\text{Other}\%}{100}$$

- **Devourer Base Shards (Lvl 35–1000):** 
  - Lvl 35: 150 shards
  - Lvl 50: 750 shards
  - Lvl 100: 15,000 shards
  - Lvl 200: 65,000 shards
  - Lvl 300: 150,000 shards
  - Lvl 500: 450,000 shards
  - Lvl 1000: 3,200,000 shards
- **Completed Feats (Tier 0–50):** Base 100% + 10% per completed tier (e.g., Tier 29 = 390% $\to$ 3.9x multiplier).
- **Legendaries & Sets %:** Starts with **Base 100%**. Individual legendary bonuses and completed set bonuses stack on top:
  - **Group 1:** Lich, Gorgon, Harpy (**+20%**)
  - **Group 2:** Reaper, Cyclops, Archdemon (**+40%**)
  - **Group 3:** Robo-Chicken, Shield Bot, Soul Stalker (**+60%**)
  - **Group 4:** The Cursed, The Colossus, The Infernal (**+80%**)
- **Hacker Group Scaling Upgrade:** Increases maximum claimable sets per group ($1 + \text{level}$). A set bonus is only granted if you possess a complete matching set of all minions in that group.
- **Other Shard Boosts %:** Input for Inventor experiments, skins, relics, and themes (default 100% = 1.0x).

---

### 6. Quick Progression Presets
- **First Prestige:** Lich + Gorgon (+1 replacement spawner kept)
- **Unholy Trio:** Lich + Gorgon + Harpy (Group 1 completed)
- **Feat 16 Milestone:** Unholy Trio + Reaper + Cyclops
- **Feat 21 / Archdemon:** Tier 1 pantheon + Archdemon (Group 2 completed)
- **Alien Mastery:** Robo-Chicken + Shield Bot + Soul Stalker (Group 3 completed)
- **Surgeon Fusion Trinity:** The Cursed + The Colossus + The Infernal (Group 4 completed)
- **Ultimate Endgame Pantheon:** All 12 legendaries, all 4 complete groups

### 7. Persistence & Accessibility
- Automatically persists all targets, owned stations, in-lair minions, stashed runes, and replacement toggles in `localStorage`.
- Fully responsive layout for desktop, tablet, and mobile.
- Accessible keyboard navigation and ARIA labels.

---

## 🛠️ Project Architecture

```
necromerger_rune_calculator/
├── src/
│   ├── types/
│   │   └── game.ts                    # Domain types, interfaces (strict TS, 0 any)
│   ├── data/
│   │   ├── gameData.ts                # Canonical costs, buffs, rune & sprite metadata
│   │   └── presets.ts                 # Milestones and progression presets
│   ├── utils/
│   │   ├── calculator.ts              # Pure math functions for station powers, deficits, and aggregate stats
│   │   └── calculator.test.ts         # Vitest suite covering all calculation logic
│   ├── hooks/
│   │   ├── useLocalStorage.ts         # Generic typed localStorage persistence hook
│   │   └── useCalculator.ts           # Custom hook managing state, offsets, and aggregation
│   ├── components/
│   │   ├── Header.tsx                 # Sticky header with quick actions and rune summary
│   │   ├── LegendaryCard.tsx          # Card with dual steppers (In Lair / To Summon), replacement toggle
│   │   ├── LairLegendariesDrawer.tsx  # Quick drawer for active in-lair minions (0 runes)
│   │   ├── TimeMachineCalculator.tsx  # Devourer level, feats, group set tracker & shard breakdown
│   │   ├── RuneSummaryBadge.tsx       # Summary badges with deficit indicators and progress bars
│   │   ├── RuneStashDrawer.tsx        # Quick drawer for banked rune inventory
│   │   ├── StatsTracker.tsx           # Live cumulative buffs and shard multiplier
│   │   ├── PresetSelector.tsx         # Modal for progression presets
│   │   └── GuideModal.tsx             # In-game rules and station fusing explanation
│   ├── App.tsx                        # Main layout, filters, and floating drawer triggers
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Gothic pixel art styling, scanline effects, scrollbars
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🚀 Running the App

### Development Server
```bash
npm run dev
```

### Run Automated Unit Tests
```bash
npm test -- --run
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📜 License
MIT License. Created for the NecroMerger community.
