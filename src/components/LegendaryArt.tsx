import React from 'react';
import { LegendaryId } from '../types/game';
import { LEGENDARIES } from '../data/gameData';

interface LegendaryArtProps {
  id: LegendaryId;
  className?: string;
}

export const LegendaryArt: React.FC<LegendaryArtProps> = ({ id, className = '' }) => {
  const def = LEGENDARIES[id];

  const renderIllustration = () => {
    switch (id) {
      case 'lich':
        return (
          <g>
            {/* Frost Aura */}
            <circle cx="50" cy="50" r="42" fill="url(#lichGlow)" opacity="0.4" />
            {/* Ice Crown Spikes */}
            <polygon points="30,35 34,14 42,30" fill="#38bdf8" />
            <polygon points="44,30 50,10 56,30" fill="#7dd3fc" />
            <polygon points="58,30 66,14 70,35" fill="#38bdf8" />
            {/* Skull Face */}
            <path
              d="M32,38 C32,24 68,24 68,38 C68,48 64,54 60,62 L60,72 C60,75 58,78 50,78 C42,78 40,75 40,72 L40,62 C36,54 32,48 32,38 Z"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
            {/* Glowing Cyan Eyes */}
            <circle cx="43" cy="45" r="5" fill="#0284c7" />
            <circle cx="43" cy="45" r="2.5" fill="#e0f2fe" />
            <circle cx="57" cy="45" r="5" fill="#0284c7" />
            <circle cx="57" cy="45" r="2.5" fill="#e0f2fe" />
            {/* Nasal Cavity */}
            <polygon points="50,52 47,58 53,58" fill="#38bdf8" />
            {/* Teeth / Jaw */}
            <line x1="44" y1="68" x2="44" y2="74" stroke="#7dd3fc" strokeWidth="2" />
            <line x1="50" y1="68" x2="50" y2="74" stroke="#7dd3fc" strokeWidth="2" />
            <line x1="56" y1="68" x2="56" y2="74" stroke="#7dd3fc" strokeWidth="2" />
            {/* Shoulders / Robe */}
            <path d="M22,90 C22,78 35,74 50,74 C65,74 78,78 78,90" fill="#082f49" stroke="#38bdf8" strokeWidth="2" />
          </g>
        );
      case 'gorgon':
        return (
          <g>
            {/* Toxic Mist */}
            <circle cx="50" cy="50" r="42" fill="url(#gorgonGlow)" opacity="0.4" />
            {/* Twisting Snakes */}
            <path d="M30,35 C20,25 22,12 34,14 C40,16 35,26 40,30" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="34" cy="14" r="2" fill="#ef4444" />
            <path d="M50,26 C50,10 62,8 60,18 C58,24 54,26 52,30" fill="none" stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="61" cy="18" r="2" fill="#ef4444" />
            <path d="M70,35 C80,25 78,12 66,14 C60,16 65,26 60,30" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="66" cy="14" r="2" fill="#ef4444" />
            <path d="M22,50 C12,42 12,30 22,32" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
            <path d="M78,50 C88,42 88,30 78,32" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
            {/* Medusa Face */}
            <ellipse cx="50" cy="54" rx="20" ry="24" fill="#064e3b" stroke="#4ade80" strokeWidth="2.5" />
            {/* Serpent Eyes (Vertical Slits) */}
            <ellipse cx="42" cy="48" rx="4.5" ry="3.5" fill="#facc15" />
            <line x1="42" y1="44" x2="42" y2="52" stroke="#000000" strokeWidth="2" />
            <ellipse cx="58" cy="48" rx="4.5" ry="3.5" fill="#facc15" />
            <line x1="58" y1="44" x2="58" y2="52" stroke="#000000" strokeWidth="2" />
            {/* Smug Serpent Mouth */}
            <path d="M44,66 Q50,72 56,66" fill="none" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
            {/* Scales on Forehead */}
            <circle cx="50" cy="38" r="2.5" fill="#86efac" />
            <circle cx="45" cy="41" r="1.5" fill="#86efac" />
            <circle cx="55" cy="41" r="1.5" fill="#86efac" />
          </g>
        );
      case 'harpy':
        return (
          <g>
            {/* Crimson Fog */}
            <circle cx="50" cy="50" r="42" fill="url(#harpyGlow)" opacity="0.4" />
            {/* Bat / Feathery Wings */}
            <path d="M12,45 Q25,20 40,36 Q30,60 18,70 Z" fill="#881337" stroke="#f43f5e" strokeWidth="2" />
            <path d="M88,45 Q75,20 60,36 Q70,60 82,70 Z" fill="#881337" stroke="#f43f5e" strokeWidth="2" />
            {/* Harpy Crest Feathers */}
            <polygon points="50,12 44,28 56,28" fill="#fb7185" />
            <polygon points="40,18 36,32 46,30" fill="#f43f5e" />
            <polygon points="60,18 64,32 54,30" fill="#f43f5e" />
            {/* Beaked Fierce Face */}
            <path d="M35,36 Q50,30 65,36 Q60,65 50,76 Q40,65 35,36 Z" fill="#4c0519" stroke="#fb7185" strokeWidth="2.5" />
            {/* Bird Mask / Piercing Crimson Eyes */}
            <polygon points="40,46 47,44 45,50" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1.5" />
            <circle cx="43" cy="47" r="2" fill="#ef4444" />
            <polygon points="60,46 53,44 55,50" fill="#ffe4e6" stroke="#e11d48" strokeWidth="1.5" />
            <circle cx="57" cy="47" r="2" fill="#ef4444" />
            {/* Sharp Curved Beak */}
            <polygon points="46,54 54,54 50,72" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          </g>
        );
      case 'reaper':
        return (
          <g>
            {/* Soul Fog */}
            <circle cx="50" cy="50" r="42" fill="url(#reaperGlow)" opacity="0.4" />
            {/* Massive Curved Scythe */}
            <path d="M18,88 L34,16" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M34,16 Q65,6 78,28 Q60,26 40,24 Z" fill="#e2e8f0" stroke="#38bdf8" strokeWidth="2" />
            {/* Deep Shadowed Cowl */}
            <path
              d="M32,32 C34,18 66,18 68,32 C74,52 74,80 72,90 C60,86 40,86 28,90 C26,80 26,52 32,32 Z"
              fill="#030712"
              stroke="#60a5fa"
              strokeWidth="2.5"
            />
            {/* Black Void of Hood */}
            <ellipse cx="50" cy="46" rx="14" ry="17" fill="#000000" />
            {/* Spectral Glowing Blue Eyes inside Hood */}
            <circle cx="44" cy="46" r="3" fill="#60a5fa" />
            <circle cx="44" cy="46" r="1.5" fill="#ffffff" />
            <circle cx="56" cy="46" r="3" fill="#60a5fa" />
            <circle cx="56" cy="46" r="1.5" fill="#ffffff" />
            {/* Moon Tome Clutched */}
            <rect x="42" y="70" width="16" height="20" rx="2" fill="#1e293b" stroke="#facc15" strokeWidth="2" />
            <circle cx="50" cy="80" r="3.5" fill="#facc15" />
          </g>
        );
      case 'cyclops':
        return (
          <g>
            {/* Giant Radiance */}
            <circle cx="50" cy="50" r="42" fill="url(#cyclopsGlow)" opacity="0.4" />
            {/* Heavy Horns */}
            <path d="M28,38 Q15,22 18,10 Q28,18 36,28" fill="#ca8a04" stroke="#a3e635" strokeWidth="2" />
            <path d="M72,38 Q85,22 82,10 Q72,18 64,28" fill="#ca8a04" stroke="#a3e635" strokeWidth="2" />
            {/* Bulky Head Profile */}
            <path
              d="M26,45 C26,26 74,26 74,45 C74,68 68,84 50,86 C32,84 26,68 26,45 Z"
              fill="#14532d"
              stroke="#a3e635"
              strokeWidth="2.5"
            />
            {/* Giant Single Eye Socket */}
            <ellipse cx="50" cy="46" rx="16" ry="14" fill="#fef08a" stroke="#ca8a04" strokeWidth="2.5" />
            {/* Slit / Glowing Pupil */}
            <circle cx="50" cy="46" r="8" fill="#15803d" />
            <circle cx="50" cy="46" r="4" fill="#000000" />
            <circle cx="48" cy="44" r="2" fill="#ffffff" />
            {/* Gruff Tusks / Teeth */}
            <polygon points="36,76 40,64 44,76" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" />
            <polygon points="64,76 60,64 56,76" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" />
            <line x1="42" y1="74" x2="58" y2="74" stroke="#052e16" strokeWidth="2" />
          </g>
        );
      case 'archdemon':
        return (
          <g>
            {/* Hellfire Violet Nebula */}
            <circle cx="50" cy="50" r="42" fill="url(#archdemonGlow)" opacity="0.45" />
            {/* Enormous Obsidian Horns */}
            <path d="M30,34 C12,18 10,2 26,2 C32,10 32,22 36,30" fill="#3b0764" stroke="#c084fc" strokeWidth="2.5" />
            <path d="M70,34 C88,18 90,2 74,2 C68,10 68,22 64,30" fill="#3b0764" stroke="#c084fc" strokeWidth="2.5" />
            {/* Crown of Spikes */}
            <polygon points="50,16 46,28 54,28" fill="#a855f7" />
            <polygon points="42,22 38,32 46,32" fill="#9333ea" />
            <polygon points="58,22 62,32 54,32" fill="#9333ea" />
            {/* Fiendish Demonic Visage */}
            <polygon points="50,86 26,45 32,28 68,28 74,45" fill="#2e1065" stroke="#e9d5ff" strokeWidth="2.5" />
            {/* 4 Burning Runed Eyes */}
            <ellipse cx="40" cy="42" rx="4" ry="2.5" fill="#f43f5e" />
            <circle cx="40" cy="42" r="1.5" fill="#ffffff" />
            <ellipse cx="60" cy="42" rx="4" ry="2.5" fill="#f43f5e" />
            <circle cx="60" cy="42" r="1.5" fill="#ffffff" />
            <ellipse cx="44" cy="52" rx="3.5" ry="2" fill="#fb7185" />
            <ellipse cx="56" cy="52" rx="3.5" ry="2" fill="#fb7185" />
            {/* Demonic Mouth & Nether Sigil */}
            <polygon points="50,60 46,68 54,68" fill="#e11d48" />
            <line x1="38" y1="74" x2="62" y2="74" stroke="#c084fc" strokeWidth="2" strokeDasharray="2 2" />
          </g>
        );
      case 'robo_chicken':
        return (
          <g>
            {/* Cyber Pulse Field */}
            <circle cx="50" cy="50" r="42" fill="url(#roboGlow)" opacity="0.4" />
            {/* Cybernetic Metallic Crest Antenna */}
            <polygon points="50,10 44,25 56,25" fill="#0d9488" stroke="#5eead4" strokeWidth="2" />
            <line x1="50" y1="10" x2="50" y2="2" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="2" r="3" fill="#ffffff" />
            {/* Robotic Body Chassis */}
            <rect x="28" y="26" width="44" height="48" rx="14" fill="#0f172a" stroke="#2dd4bf" strokeWidth="2.5" />
            {/* Digital Visor / Sensor Array */}
            <rect x="34" y="36" width="32" height="12" rx="3" fill="#134e4a" stroke="#5eead4" strokeWidth="1.5" />
            <line x1="36" y1="42" x2="64" y2="42" stroke="#2dd4bf" strokeWidth="3" />
            <circle cx="50" cy="42" r="3" fill="#ffffff" />
            {/* Steel Cyber Beak */}
            <polygon points="44,52 56,52 50,66" fill="#f59e0b" stroke="#fcd34d" strokeWidth="2" />
            {/* Neon Wattle Energy Conduit */}
            <ellipse cx="50" cy="72" rx="4" ry="7" fill="#ec4899" opacity="0.85" />
            {/* Circuit Screws */}
            <circle cx="34" cy="30" r="2" fill="#64748b" />
            <circle cx="66" cy="30" r="2" fill="#64748b" />
            <line x1="30" y1="58" x2="38" y2="58" stroke="#2dd4bf" strokeWidth="1.5" />
            <line x1="62" y1="58" x2="70" y2="58" stroke="#2dd4bf" strokeWidth="1.5" />
          </g>
        );
      case 'stalker':
        return (
          <g>
            {/* Interdimensional Portal Rift */}
            <circle cx="50" cy="50" r="42" fill="url(#stalkerGlow)" opacity="0.45" />
            {/* Dimensional Tentacles */}
            <path d="M22,30 Q8,45 16,70 Q24,55 30,50" fill="#431407" stroke="#fb923c" strokeWidth="2" />
            <path d="M78,30 Q92,45 84,70 Q76,55 70,50" fill="#431407" stroke="#fb923c" strokeWidth="2" />
            <path d="M50,90 Q40,75 50,68 Q60,75 50,90" fill="#431407" stroke="#f97316" strokeWidth="2" />
            {/* Alien Bio-Carapace Head */}
            <ellipse cx="50" cy="42" rx="26" ry="24" fill="#1c1917" stroke="#fb923c" strokeWidth="2.5" />
            {/* Cluster of Glowing Orange Alien Eyes */}
            <circle cx="50" cy="34" r="5" fill="#f97316" stroke="#fed7aa" strokeWidth="1.5" />
            <circle cx="50" cy="34" r="2.5" fill="#ffffff" />
            <circle cx="38" cy="42" r="4" fill="#ea580c" stroke="#fed7aa" strokeWidth="1.5" />
            <circle cx="38" cy="42" r="2" fill="#ffffff" />
            <circle cx="62" cy="42" r="4" fill="#ea580c" stroke="#fed7aa" strokeWidth="1.5" />
            <circle cx="62" cy="42" r="2" fill="#ffffff" />
            <circle cx="44" cy="52" r="3" fill="#f97316" />
            <circle cx="56" cy="52" r="3" fill="#f97316" />
            {/* Void Energy Ring */}
            <circle cx="50" cy="42" r="20" fill="none" stroke="#fed7aa" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-slate-950/80 border border-slate-700/60 flex items-center justify-center ${className}`}
      style={{
        boxShadow: `inset 0 0 25px rgba(0, 0, 0, 0.8), 0 0 12px ${def.glowColor}`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="lichGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gorgonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="harpyGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="reaperGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cyclopsGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a3e635" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#65a30d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="archdemonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="roboGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="stalkerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c2410c" stopOpacity="0" />
          </radialGradient>
        </defs>
        {renderIllustration()}
      </svg>
    </div>
  );
};
