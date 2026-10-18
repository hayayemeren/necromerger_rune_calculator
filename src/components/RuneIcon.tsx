import React from 'react';
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

  // Unique rune glyphs for each type
  const renderGlyph = () => {
    switch (type) {
      case 'ice':
        // Frost flake / crystalline diamond
        return (
          <>
            <polygon points="50,15 85,50 50,85 15,50" fill="url(#iceGrad)" stroke="#67e8f9" strokeWidth="3" />
            <line x1="50" y1="20" x2="50" y2="80" stroke="#cffafe" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="50" x2="80" y2="50" stroke="#cffafe" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="30" y1="30" x2="70" y2="70" stroke="#a5f3fc" strokeWidth="1.5" />
            <line x1="70" y1="30" x2="30" y2="70" stroke="#a5f3fc" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="4" fill="#ffffff" />
          </>
        );
      case 'poison':
        // Toxic droplet / biohazard cauldron flask
        return (
          <>
            <path
              d="M50,15 C50,15 25,48 25,65 C25,79 36,90 50,90 C64,90 75,79 75,65 C75,48 50,15 50,15 Z"
              fill="url(#poisonGrad)"
              stroke="#4ade80"
              strokeWidth="3"
            />
            <circle cx="43" cy="62" r="5" fill="#86efac" opacity="0.8" />
            <circle cx="58" cy="72" r="3.5" fill="#bbf7d0" opacity="0.9" />
            <circle cx="52" cy="50" r="2.5" fill="#ffffff" opacity="0.85" />
            <path d="M48,32 C48,32 38,50 38,62" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </>
        );
      case 'blood':
        // Piercing crimson blood gem / dagger heart
        return (
          <>
            <polygon points="50,12 82,38 70,88 30,88 18,38" fill="url(#bloodGrad)" stroke="#f87171" strokeWidth="3" />
            <line x1="50" y1="12" x2="50" y2="88" stroke="#fee2e2" strokeWidth="2" opacity="0.7" />
            <line x1="18" y1="38" x2="82" y2="38" stroke="#fca5a5" strokeWidth="1.5" opacity="0.6" />
            <polygon points="50,25 68,45 50,75 32,45" fill="#ef4444" opacity="0.5" />
            <circle cx="50" cy="50" r="3" fill="#ffffff" />
          </>
        );
      case 'moon':
        // Luminous crescent moon stone
        return (
          <>
            <circle cx="50" cy="50" r="36" fill="url(#moonGrad)" stroke="#facc15" strokeWidth="3" />
            <path
              d="M56,18 C40,24 30,39 30,55 C30,71 40,86 56,92 C42,88 34,74 34,55 C34,36 42,22 56,18 Z"
              fill="#fef08a"
              opacity="0.9"
            />
            <polygon points="68,34 70,39 75,39 71,42 73,47 68,44 63,47 65,42 61,39 66,39" fill="#ffffff" />
            <circle cx="64" cy="62" r="3" fill="#fef9c3" />
          </>
        );
      case 'death':
        // Necrotic gothic skull / soul urn
        return (
          <>
            <polygon points="50,10 88,32 80,82 50,94 20,82 12,32" fill="url(#deathGrad)" stroke="#c084fc" strokeWidth="3" />
            <path
              d="M36,44 C36,36 42,32 50,32 C58,32 64,36 64,44 C64,52 58,56 50,56 C42,56 36,52 36,44 Z"
              fill="#581c87"
              stroke="#e9d5ff"
              strokeWidth="2"
            />
            <circle cx="44" cy="42" r="3" fill="#ffffff" />
            <circle cx="56" cy="42" r="3" fill="#ffffff" />
            <line x1="45" y1="58" x2="45" y2="66" stroke="#e9d5ff" strokeWidth="2" />
            <line x1="50" y1="58" x2="50" y2="68" stroke="#e9d5ff" strokeWidth="2" />
            <line x1="55" y1="58" x2="55" y2="66" stroke="#e9d5ff" strokeWidth="2" />
          </>
        );
      case 'cosmic':
        // Cosmic spiral galaxy / dimensional vortex
        return (
          <>
            <polygon points="50,12 85,30 85,70 50,88 15,70 15,30" fill="url(#cosmicGrad)" stroke="#2dd4bf" strokeWidth="3" />
            <circle cx="50" cy="50" r="16" fill="none" stroke="#99f6e4" strokeWidth="2.5" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="8" fill="#5eead4" />
            <circle cx="50" cy="50" r="3" fill="#ffffff" />
            <circle cx="70" cy="35" r="2" fill="#ffffff" />
            <circle cx="30" cy="65" r="2" fill="#ffffff" />
            <circle cx="65" cy="65" r="1.5" fill="#ccfbf1" />
          </>
        );
      case 'astro':
        // Astro planetary ring / stellar reactor core
        return (
          <>
            <polygon points="50,14 86,50 50,86 14,50" fill="url(#astroGrad)" stroke="#fb923c" strokeWidth="3" />
            <ellipse cx="50" cy="50" rx="32" ry="12" fill="none" stroke="#fed7aa" strokeWidth="2.5" transform="rotate(-25 50 50)" />
            <circle cx="50" cy="50" r="12" fill="#ea580c" stroke="#ffedd5" strokeWidth="2" />
            <circle cx="50" cy="50" r="5" fill="#ffffff" />
          </>
        );
      case 'energy':
        // Hyper-dense pink plasma prism / lightning crystal
        return (
          <>
            <polygon points="50,8 88,40 74,90 26,90 12,40" fill="url(#energyGrad)" stroke="#f472b6" strokeWidth="3" />
            <polygon points="52,20 40,46 54,46 44,78 64,48 50,48" fill="#ffffff" stroke="#fbcfe8" strokeWidth="1.5" />
            <circle cx="50" cy="48" r="2.5" fill="#ffffff" />
          </>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${dimensionClass} ${className}`}
      style={glow ? { filter: `drop-shadow(0 0 6px ${meta.accentGlow})` } : undefined}
      title={meta.name}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="iceGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#164e63" />
          </radialGradient>
          <radialGradient id="poisonGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </radialGradient>
          <radialGradient id="bloodGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>
          <radialGradient id="moonGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="55%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#713f12" />
          </radialGradient>
          <radialGradient id="deathGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="50%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#4c1d95" />
          </radialGradient>
          <radialGradient id="cosmicGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#99f6e4" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#134e4a" />
          </radialGradient>
          <radialGradient id="astroGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </radialGradient>
          <radialGradient id="energyGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="50%" stopColor="#db2777" />
            <stop offset="100%" stopColor="#701a75" />
          </radialGradient>
        </defs>
        {renderGlyph()}
      </svg>
    </div>
  );
};
