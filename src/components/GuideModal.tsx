import React from 'react';
import { X, BookOpen, Layers, ShieldCheck, Zap } from 'lucide-react';

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
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="guide-modal-title" className="text-lg font-bold font-serif text-white">
                NecroMerger Fusing & Station Math Guide
              </h2>
              <p className="text-xs text-slate-400">
                How station leveling, legendaries, and rune costs scale
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
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          {/* Rule 1: Power of 2 Scaling */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <h3 className="font-bold text-sm text-purple-300 mb-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              1. Station Leveling (Powers of 2)
            </h3>
            <p className="text-slate-400">
              In NecroMerger, merging stations follows binary progression: 2^(level - 1):
            </p>
            <ul className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <li className="bg-slate-900 p-1.5 rounded border border-slate-800">
                Level 1 = <strong>1</strong> base
              </li>
              <li className="bg-slate-900 p-1.5 rounded border border-slate-800">
                Level 2 = <strong>2</strong> base
              </li>
              <li className="bg-slate-900 p-1.5 rounded border border-slate-800">
                Level 3 = <strong>4</strong> base
              </li>
              <li className="bg-slate-900 p-1.5 rounded border border-slate-800">
                Level 4 = <strong>8</strong> base
              </li>
              <li className="bg-slate-900 p-1.5 rounded border border-slate-800 col-span-2 sm:col-span-1 text-amber-300">
                Level 5 = <strong>16</strong> base
              </li>
            </ul>
          </div>

          {/* Rule 2: Legendary Fusion Cost */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <h3 className="font-bold text-sm text-indigo-300 mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              2. Fusing a Legendary Minion
            </h3>
            <p className="text-slate-400">
              Merging a Legendary consumes <strong>two max-tier (Level 5) stations</strong>.
              <br />
              Standard fusion: $2 \times 16 = \mathbf{32}$ Level 1 base stations.
            </p>
          </div>

          {/* Rule 3: Keep Replacement Spawner */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-teal-500/30 bg-teal-950/20">
            <h3 className="font-bold text-sm text-teal-300 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              3. The "Keep Replacement Spawner" Rule
            </h3>
            <p className="text-slate-300">
              When you merge a Legendary, both Level 5 stations disappear from your lair! To prevent losing your primary resource generator, experienced necromancers build <strong>3 Level 5 stations</strong> ($3 \times 16 = \mathbf{48}$ Level 1s): 2 are consumed in the ritual, leaving 1 active Level 5 spawner in your lair.
            </p>
          </div>

          {/* Rule 4: Owned Stations Offset */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <h3 className="font-bold text-sm text-emerald-300 mb-1">
              4. Owned Station Deductions
            </h3>
            <p className="text-slate-400">
              If you already have spare stations on your board or in your crate, expand the <em>"Subtract Owned Stations"</em> drawer under each card. Each existing station directly credits toward your target, reducing the net runes you still need to farm.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
