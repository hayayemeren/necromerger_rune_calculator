# NecroMerger Legendary & Rune Calculator 💀🔮

A complete, production-ready web application for calculating station requirements, rune costs, banked stash deficits, and cumulative stat multipliers in **NecroMerger**. Built with **React 18**, **TypeScript** (strictly typed without `any`), and **Tailwind CSS** (Vite setup).

---

## ✨ Key Features

### 1. Canonical Fusing & Station Math
- **Station Level Scaling:** Binary progression ($2^{\text{Level}-1}$):
  - L1 = $1$ base station
  - L2 = $2$ base stations
  - L3 = $4$ base stations
  - L4 = $8$ base stations
  - L5 = $16$ base stations
- **Standard Fusion:** Consumes **2× Level 5 stations** = 32 Level 1 base stations.
- **"Keep a Replacement Spawner" Feature:** Toggle per-legendary and globally to build **3× Level 5 stations** instead of 2 (48 Level 1 stations). Guarantees you keep one functional Level 5 spawner in your lair after the merge ritual.
- **Owned Station Offsets (L1–L5):** Expandable section under each legendary to enter existing stations on your board or crate. Each owned station reduces required Level 1 count by $2^{\text{Level}-1}$.
- **Non-negative Floor:** Net required base stations cannot drop below zero.

### 2. Live Rune Aggregation & Stash Deficit Tracker
- Computes gross runes required across all active goals based on canonical base L1 purchase costs.
- **Banked Runes / Inventory Drawer:** Quick-access drawer to input banked runes with `+20`, `+100`, `+500`, and "Match All Needed" one-click autofill.
- **Live Deficit Calculation:** $\text{Deficit} = \max(0, \text{Gross Required} - \text{Stash})$.
- Displays progress bars and completion badges (Ready / Deficit) across all 8 rune types.

### 3. Live Stats & Multiplier Projections
- **Time Shard Multiplier ($+\%$):** Cumulative boost for prestige resets.
- **Resource Cap Increases ($+\%$):** Real-time tracked bonuses for Max Mana, Max Slime, and Max Darkness.

### 4. Canonical Game Data (`gameData.ts`)

| Legendary | Category | Group | Station(s) | Base L1 Cost | Buffs |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Lich** | Undead | Group 1 | 2× L5 Grave | 20 Ice | +5% Shards, +10% Max Mana |
| **Gorgon** | Unholy | Group 1 | 2× L5 Cupboard | 20 Poison | +5% Shards, +10% Max Slime |
| **Harpy** | Unholy | Group 1 | 2× L5 Altar | 20 Blood | +5% Shards, +10% Max Darkness |
| **Reaper** | Undead | Group 2 | 2× L5 Lectern | 20 Moon + 10 Ice | +10% Shards, +10% Max Mana |
| **Cyclops** | Unholy | Group 2 | 2× L5 Fridge | 20 Moon + 10 Poison | +10% Shards, +10% Max Slime |
| **Archdemon** | Eldritch | Group 2 | 2× L5 Portal | 20 Death + 10 Blood | +20% Shards, +10% Max Darkness |
| **Robo-Chicken** | Alien | Group 3 | 2× L5 Chicken | 20 Cosmic | +10% Shards |
| **Soul Stalker** | Alien | Group 3 | 2× L5 Alien Station | 25 Astro + 10 Energy | +25% Shards |
| **Shield Bot** | Alien | Group 3 | 2× L5 Crashed Saucer | 20 Cosmic + 10 Astro | +30% Shards, +10% Shield Chance |
| **The Cursed** | Fusion | Group 4 | 2× L5 Grave + 2× L5 Lectern | 20 Ice / 20 Moon + 10 Ice | +30% Shards, +20% All Resource Gen |
| **The Colossus** | Fusion | Group 4 | 2× L5 Cupboard + 2× L5 Fridge | 20 Poison / 20 Moon + 10 Poison | +30% Shards, Combat Food Spawns |
| **The Infernal** | Fusion | Group 4 | 2× L5 Altar + 2× L5 Portal | 20 Blood / 20 Death + 10 Blood | +30% Shards, +5% Merge Duplicate |

---

### 5. Time Machine & Prestige Shard Calculator

$$\text{Total Shards} = \text{Base}(\text{Devourer Lvl}) \times (1 + \text{Feats}\%) \times (1 + \text{Legendaries}\% + \text{Groups}\%) \times (1 + \text{Other}\%)$$

- **Devourer Level (35–100):** Base shards scaling from 150 (Lvl 35) up to 15,000 (Lvl 100).
- **Feats Completed (Tier 0–22):** +10% multiplicative boost per completed tier (+0% to +220%).
- **Legendary Sets / Groups:**
  - **Group 1:** Lich, Gorgon, Harpy (+20% Group Bonus)
  - **Group 2:** Reaper, Cyclops, Archdemon (+30% Group Bonus)
  - **Group 3:** Robo-Chicken, Stalker, Shield Bot (+40% Group Bonus)
  - **Group 4:** The Cursed, The Colossus, The Infernal (+60% Group Bonus)
- **Hacker Group Scaling Upgrade:** Scales completed group bonuses by $(1 + \text{upgradeLevel})$ (allowing group bonuses to be claimed multiple times).
- **Other Shard Boosts:** Input for Inventor experiments, skins, relics, and lair themes.

### 5. Quick Progression Presets
- **First Prestige:** Lich + Gorgon (+1 replacement spawner kept)
- **Unholy Trio:** Lich + Gorgon + Harpy
- **Feat 16 Milestone:** Unholy Trio + Reaper + Cyclops
- **Feat 21 / Archdemon:** Tier 1 pantheon + Archdemon
- **All 8 Legendaries:** Full endgame set (+90% Time Shards)
- **Time Shard Stacking:** Multi-copy mass farming configuration

### 6. Persistence & Accessibility
- Automatically persists all targets, owned stations, stashed runes, and replacement toggles in `localStorage`.
- Fully responsive layout for desktop, tablet, and mobile.
- Accessible keyboard navigation and ARIA labels.

---

## 🛠️ Project Architecture

```
necromerger_rune_calculator/
├── src/
│   ├── types/
│   │   └── game.ts               # Domain types, interfaces (strict TS, 0 any)
│   ├── data/
│   │   ├── gameData.ts           # Canonical costs, buffs, rune metadata
│   │   └── presets.ts            # Milestones and progression presets
│   ├── utils/
│   │   ├── calculator.ts         # Pure math functions for station powers, deficits, and aggregate stats
│   │   └── calculator.test.ts    # Vitest suite covering all calculation logic
│   ├── hooks/
│   │   ├── useLocalStorage.ts    # Generic typed localStorage persistence hook
│   │   └── useCalculator.ts      # Custom hook managing state, offsets, and aggregation
│   ├── components/
│   │   ├── Header.tsx            # Sticky header with quick actions and rune summary
│   │   ├── LegendaryCard.tsx     # Card with stepper, spawner toggle, owned stations drawer
│   │   ├── LegendaryArt.tsx      # Vector SVG illustrations for all 8 legendaries
│   │   ├── RuneIcon.tsx          # Intricate vector SVG icons for all 8 runes
│   │   ├── RuneSummaryBadge.tsx  # Summary badges with deficit indicators and progress bars
│   │   ├── RuneStashDrawer.tsx   # Quick drawer for banked rune inventory
│   │   ├── StatsTracker.tsx      # Live cumulative buffs and shard multiplier
│   │   ├── PresetSelector.tsx    # Modal for progression presets
│   │   └── GuideModal.tsx        # In-game rules and station fusing explanation
│   ├── App.tsx                   # Main layout and filter bar
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Gothic theme styling, gradients, scrollbars
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
npm test
```

### Production Build
```bash
npm run build
npm run preview
```
