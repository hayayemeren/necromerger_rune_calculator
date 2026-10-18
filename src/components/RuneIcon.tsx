import React, { useState } from 'react';
import { RuneType } from '../types/game';
import { RUNES } from '../data/gameData';

interface RuneIconProps {
  type: RuneType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
}

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-9 h-9',
  xl: 'w-12 h-12',
};

export const RuneIcon: React.FC<RuneIconProps> = ({
  type,
  size = 'md',
  className = '',
  glow = false,
}) => {
  const meta = RUNES[type];
  const dimensionClass = sizeClasses[size];
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${dimensionClass} ${className}`}
      style={glow ? { filter: `drop-shadow(0 0 6px ${meta.accentGlow})` } : undefined}
      title={meta.name}
    >
      {!imgError && meta.imageSrc ? (
        <img
          src={meta.imageSrc}
          alt={meta.name}
          className="w-full h-full object-contain [image-rendering:pixelated]"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full rounded flex items-center justify-center text-[10px] font-bold font-mono uppercase border border-slate-700 bg-slate-800"
          style={{ color: meta.hex }}
        >
          {type.slice(0, 2)}
        </div>
      )}
    </div>
  );
};
