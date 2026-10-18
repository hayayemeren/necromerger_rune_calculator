/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkbg: '#0a0f1d',
        cardbg: '#111827',
        cardborder: '#1f2937',
        runecyan: '#06b6d4',
        runegreen: '#22c55e',
        runered: '#ef4444',
        runeyellow: '#eab308',
        runepurple: '#a855f7',
        runeteal: '#14b8a6',
        runeorange: '#f97316',
        runepink: '#ec4899',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'rune-glow-cyan': '0 0 15px -2px rgba(6, 182, 212, 0.45)',
        'rune-glow-green': '0 0 15px -2px rgba(34, 197, 94, 0.45)',
        'rune-glow-red': '0 0 15px -2px rgba(239, 68, 68, 0.45)',
        'rune-glow-yellow': '0 0 15px -2px rgba(234, 179, 8, 0.45)',
        'rune-glow-purple': '0 0 15px -2px rgba(168, 85, 247, 0.45)',
        'rune-glow-teal': '0 0 15px -2px rgba(20, 184, 166, 0.45)',
        'rune-glow-orange': '0 0 15px -2px rgba(249, 115, 22, 0.45)',
        'rune-glow-pink': '0 0 15px -2px rgba(236, 72, 153, 0.45)',
        'gold-glow': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
      }
    },
  },
  plugins: [],
}
