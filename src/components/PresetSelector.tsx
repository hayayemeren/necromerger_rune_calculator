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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preset-modal-title"
    >
      <div className="bg-slate-900 border-4 border-slate-700 rounded-2xl max-w-xl w-full shadow-pixel overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-950 border border-indigo-500 text-indigo-400 rounded-lg">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 id="preset-modal-title" className="font-pixel text-xs sm:text-sm text-white tracking-wider">
                MILESTONE PRESETS
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Load canonical target configurations for Feats and prestige resets
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
                className="w-full text-left p-3.5 rounded-xl border-2 border-slate-800 bg-slate-950/80 hover:bg-slate-850 hover:border-indigo-500 shadow-pixel-sm transition-all group flex items-start justify-between gap-3 active:translate-y-0.5"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-pixel text-[11px] text-white group-hover:text-indigo-300 transition-colors">
                      {preset.name}
                    </span>
                    <span className="font-pixel text-[8px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {preset.badge}
                    </span>
                    {preset.keepReplacement && (
                      <span className="font-pixel text-[8px] px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-500">
                        +1 SPAWNER
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-mono leading-relaxed">
                    {preset.description}
                  </p>

                  {/* Targets preview chips */}
                  {hasTargets && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Object.entries(preset.targets)
                        .filter(([, qty]) => (qty ?? 0) > 0)
                        .map(([id, qty]) => (
                          <span
                            key={id}
                            className="text-[10px] font-mono bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300 uppercase"
                          >
                            {id.replace('the_', '')}: <strong className="text-indigo-400">{qty}</strong>
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
        <div className="p-3 border-t-2 border-slate-800 bg-slate-950 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-pixel text-[10px] text-slate-400 hover:text-white transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};
