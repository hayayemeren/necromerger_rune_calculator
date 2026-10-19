# NecroMerger Legendary and Rune Calculator 💀🔮

A complete, production-ready web application for calculating station requirements, rune costs, banked stash deficits, and cumulative stat multipliers in **NecroMerger**. Built with **React 18**, **TypeScript** (strictly typed without `any`), and **Tailwind CSS** (Vite setup). Features authentic pixel-art styling, official game sprites, and canonical prestige math.

---

## 📖 How to Use the Calculator

Follow these steps to plan your merges, optimize rune farming, and maximize Time Shards before using the Time Machine:

### Step 1: Set Your Prestige Parameters (Time Machine)
1. **Devourer Level:** Enter your current Devourer level (unlocks at Lvl 35 with 150 shards, scaling up to Lvl 1000 with 3,200,000 shards).
2. **Completed Feats:** Enter your completed feat tier (Base 100% + 10% per completed tier; e.g. Feat 29 = 390% or 3.9x).
3. **Other Shard Boosts %:** Enter bonuses from Inventor experiments, relics, skins, and lair themes (default is 100% = 1.0x; e.g. enter 240% for 2.4x).
4. **Group Upgrade Level:** If you bought The Hacker's Group Scaling Upgrade, set its level (0–10) to multiply bonuses for full duplicate sets.

### Step 2: Input Legendaries Already in Your Lair
1. Click the **"In Lair"** vault button in the header or the floating purple button at the bottom-right.
2. Enter the quantity of each legendary already sitting active in your lair.
3. **Key Benefit:** In-lair minions cost **0 runes** and **0 stations** to summon, but immediately grant full Time Shard %, resource bonuses, and complete Legendary Set Groups!

### Step 3: Choose Target Legendaries to Craft
1. Browse through the 12 legendary cards (filtered by Undead, Unholy, Eldritch, Alien, and Surgeon Fusion).
2. Use the **`+` / `-` buttons** under **"To Summon (Craft)"** to choose how many new minions you want to fuse before prestige.
3. Board caps are automatically enforced (e.g. max 4 Archdemons, max 4 Robo-Chickens, max 4 Shield Bots, max 1 of each Surgeon Fusion).

### Step 4: Toggle Replacement Spawners
1. Fusing a standard legendary consumes **two Level 5 stations** (32 Level 1 base stations).
2. If you still need that spawner for resource production, toggle **"Keep +1 Spawner"** on the card (or click **"Preserve All Spawners"** in the top header).
3. This automatically plans for **3× Level 5 stations** (48 Level 1 base), ensuring 1 active spawner remains in your lair after the merge ritual.

### Step 5: Subtract Owned Stations (L1–L5)
1. Click **"Subtract Owned Stations (L1–L5)"** on any minion card.
2. Enter the number of existing stations you currently have sitting on your board or in crates.
3. The calculator converts them into Level 1 base equivalents ($2^{\text{Level}-1}$) and automatically deducts them from your required runes.

### Step 6: Banked Runes and Live Deficits
1. Click the **"Banked Runes"** inventory button in the sticky top header.
2. Enter your current stash for each of the 8 rune types (or use `+20`, `+100`, `+500`, or "Match All Needed" shortcuts).
3. The top sticky header displays color-coded badges for all runes with instant **"READY"** or **"-X NEEDED"** deficit status and visual progress bars.

### Step 7: Explore Milestones with Presets
1. Click the **"Presets"** button in the header.
2. Choose from curated milestone setups such as *First Prestige*, *Unholy Trio*, *Feat 16 Milestone*, *Feat 21 / Archdemon*, *Surgeon Fusion Trinity*, or *Ultimate Endgame Pantheon*.

---

## ✨ Key Features

### 1. Canonical Fusing and Station Math
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

### 3. Live Rune Aggregation and Stash Deficit Tracker
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

### 5. Time Machine and Prestige Shard Calculator

> **Canonical Formula:**  
> `Total Time Shards = Base(Devourer Level) × (Feats % / 100) × (Legendaries & Sets % / 100) × (Other % / 100)`

```math
\text{Total Time Shards} = \text{Base}(\text{Devourer Level}) \times \frac{\text{Feats Multiplier}}{100} \times \frac{\text{Legendaries and Sets Multiplier}}{100} \times \frac{\text{Other Multiplier}}{100}
```

- **Devourer Base Shards (Lvl 35–1000):** 
  - Lvl 35: 150 shards
  - Lvl 50: 750 shards
  - Lvl 100: 15,000 shards
  - Lvl 200: 65,000 shards
  - Lvl 300: 150,000 shards
  - Lvl 500: 450,000 shards
  - Lvl 1000: 3,200,000 shards
- **Completed Feats (Tier 0–50):** Base 100% + 10% per completed tier (e.g., Tier 29 = 390% $\to$ 3.9x multiplier).
- **Legendaries and Sets %:** Starts with **Base 100%**. Individual legendary bonuses and completed set bonuses stack on top:
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

### 7. Persistence and Accessibility
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
