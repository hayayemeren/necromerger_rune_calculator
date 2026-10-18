import React from 'react';
import { X, BookOpen, Layers, ShieldCheck, Sparkles, Flame } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div className="bg-slate-900 border-4 border-slate-700 rounded-2xl max-w-xl w-full shadow-pixel overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-950 border border-purple-500 text-purple-400 rounded-xl shadow-pixel-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="guide-modal-title" className="font-pixel text-xs sm:text-sm text-white tracking-wider">
                NECROMERGER RULES & GUIDE
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Station leveling, Surgeon fusions, and Time Machine formulas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-300 leading-relaxed font-mono">
          {/* Rule 1: Power of 2 Scaling */}
          <div className="p-3.5 rounded-xl bg-slate-950 border-2 border-slate-800 shadow-pixel-sm">
            <h3 className="font-pixel text-[10px] text-purple-300 mb-1 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              1. Station Powers of 2
            </h3>
            <p className="text-slate-400">
              Station merging follows binary scaling: 2^(level - 1).
            </p>
            <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <li className="bg-slate-900 p-1.5 rounded border border-slate-800">
                L1 = <strong>1</strong> base
              </li>
              <li className="bg-slate-900 p-1.5 rounded border border-slate-800">
                L2 = <strong>2</strong> base
              </li>
              <li className="bg-slate-900 p-1.5 rounded border border-slate-800">
                L3 = <strong>4</strong> base
              </li>
              <li className="bg-slate-900 p-1.5 rounded border border-slate-800">
                L4 = <strong>8</strong> base
              </li>
              <li className="bg-slate-900 p-1.5 rounded border border-slate-800 col-span-2 sm:col-span-1 text-amber-300">
                L5 = <strong>16</strong> base
              </li>
            </ul>
          </div>

          {/* Rule 2: Keep Replacement Spawner */}
          <div className="p-3.5 rounded-xl bg-slate-950 border-2 border-teal-500/50 shadow-pixel-sm">
            <h3 className="font-pixel text-[10px] text-teal-300 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              2. Keep +1 Replacement Spawner
            </h3>
            <p className="text-slate-300">
              Merging a standard legendary consumes <strong>two Level 5 stations</strong> (32 Level 1 base).
              Enabling *"Keep Replacement"* crafts <strong>3× Level 5 stations</strong> (48 Level 1 base), leaving 1 active spawner in your lair so resource generation doesn't grind to a halt.
            </p>
          </div>

          {/* Rule 3: Surgeon Combination Legendaries */}
          <div className="p-3.5 rounded-xl bg-slate-950 border-2 border-indigo-500/50 shadow-pixel-sm">
            <h3 className="font-pixel text-[10px] text-indigo-300 mb-1 flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-indigo-400" />
              3. Surgeon Combination Legendaries
            </h3>
            <p className="text-slate-400 mb-2">
              Unlocked via The Surgeon using Astro Coins & Energy Cubes:
            </p>
            <ul className="space-y-1.5 text-[11px]">
              <li className="bg-slate-900 p-2 rounded border border-slate-800">
                <strong className="text-indigo-300">The Cursed:</strong> Fused from 1× Lich + 1× Reaper (2× L5 Grave + 2× L5 Lectern). Grants +20% resource gen & +30% Time Shards.
              </li>
              <li className="bg-slate-900 p-2 rounded border border-slate-800">
                <strong className="text-lime-300">The Colossus:</strong> Fused from 1× Gorgon + 1× Cyclops (2× L5 Cupboard + 2× L5 Fridge). Grants combat food generation & +30% Time Shards.
              </li>
              <li className="bg-slate-900 p-2 rounded border border-slate-800">
                <strong className="text-rose-300">The Infernal:</strong> Fused from 1× Harpy + 1× Archdemon (2× L5 Altar + 2× L5 Portal). Grants 5% duplicate minion chance & +30% Time Shards.
              </li>
            </ul>
          </div>

          {/* Rule 4: Time Machine Formula & Groups */}
          <div className="p-3.5 rounded-xl bg-slate-950 border-2 border-amber-500/50 shadow-pixel-sm">
            <h3 className="font-pixel text-[10px] text-amber-300 mb-1 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              4. Time Machine Shards & Group Bonuses
            </h3>
            <p className="text-slate-400 mb-2">
              Formula:
              <br />
              <code className="text-amber-300 font-bold">
                Base(Lvl) × (1 + Feats%) × (1 + Legendaries% + Groups%) × (1 + Other%)
              </code>
            </p>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>• <strong>Devourer Base:</strong> Unlocks at Lvl 35 (150 shards), scales up to Lvl 100 (15,000 shards).</li>
              <li>• <strong>Feats:</strong> +10% multiplier per completed Tier (up to Tier 22 = +220%).</li>
              <li>• <strong>Groups:</strong> Group 1 (+20%), Group 2 (+30%), Group 3 (+40%), Group 4 (+60%).</li>
              <li>• <strong>Hacker Upgrade:</strong> Scales group bonus by (1 + upgradeLevel).</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t-2 border-slate-800 bg-slate-950 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-pixel text-[10px] rounded-xl shadow-pixel active:translate-y-0.5 transition-all"
          >
            GOT IT!
          </button>
        </div>
      </div>
    </div>
  );
};
