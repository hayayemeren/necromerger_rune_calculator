import React from 'react';
import { PRESETS, PresetDef } from '../data/presets';
import { Bookmark, Sparkles, X } from 'lucide-react';

interface PresetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetDef) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preset-modal-title"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 id="preset-modal-title" className="text-lg font-bold font-serif text-white">
                Quick Milestone Presets
              </h2>
              <p className="text-xs text-slate-400">
                Load canonical target configurations for NecroMerger feats and prestige resets
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close presets modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {PRESETS.map((preset) => {
            const hasTargets = Object.values(preset.targets).some((qty) => (qty ?? 0) > 0);

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="w-full text-left p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 hover:border-indigo-500/50 transition-all duration-200 group flex items-start justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {preset.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {preset.badge}
                    </span>
                    {preset.keepReplacement && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/30">
                        +1 Spawner Kept
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {preset.description}
                  </p>

                  {/* Targets preview chips */}
                  {hasTargets && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {Object.entries(preset.targets)
                        .filter(([, qty]) => (qty ?? 0) > 0)
                        .map(([id, qty]) => (
                          <span
                            key={id}
                            className="text-[10px] font-mono bg-slate-900 border border-slate-700/80 px-2 py-0.5 rounded text-slate-300"
                          >
                            {id}: <strong className="text-indigo-400 font-bold">{qty}</strong>
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 p-2 text-slate-500 group-hover:text-indigo-400 transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
