import React, { useState } from 'react';
import { LegendaryId } from '../types/game';
import { LEGENDARIES } from '../data/gameData';

interface LegendaryArtProps {
  id: LegendaryId;
  className?: string;
}

export const LegendaryArt: React.FC<LegendaryArtProps> = ({ id, className = '' }) => {
  const def = LEGENDARIES[id];
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-slate-950/90 border-2 border-slate-700/80 shadow-pixel flex items-center justify-center p-1.5 ${className}`}
      style={{
        boxShadow: `inset 0 0 15px rgba(0, 0, 0, 0.9), 3px 3px 0px #000000`,
      }}
    >
      {/* Background glow accent */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${def.accentColor} 0%, transparent 70%)`,
        }}
      />

      {!imgError && def.imageSrc ? (
        <img
          src={def.imageSrc}
          alt={def.name}
          className="w-full h-full object-contain [image-rendering:pixelated] relative z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-1">
          <span className="font-pixel text-[9px] uppercase tracking-wider text-slate-300">
            {def.name}
          </span>
          <span className="text-[8px] font-mono text-slate-500 uppercase mt-0.5">
            {def.category}
          </span>
        </div>
      )}
    </div>
  );
};
