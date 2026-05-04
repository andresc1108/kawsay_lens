/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base:    '#080811',
        surface: '#0e0e1c',
        panel:   '#131328',
        rim:     'rgba(255,255,255,0.07)',
        violet:  '#8b5cf6',
        cyan:    '#22d3ee',
        emerald: '#4ade80',
        amber:   '#fbbf24',
        rose:    '#f87171',
        muted:   '#52525b',
        subtle:  '#a1a1aa',
      },
      backgroundImage: {
        'grad-brand':  'linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%)',
        'grad-subtle': 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(34,211,238,0.06) 100%)',
        'dot-grid':    'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.045) 1px, transparent 0)',
      },
      backgroundSize: {
        'grid': '28px 28px',
      },
      boxShadow: {
        'glow-v':  '0 0 24px rgba(139,92,246,0.35)',
        'glow-c':  '0 0 24px rgba(34,211,238,0.3)',
        'glow-sm': '0 0 12px rgba(139,92,246,0.2)',
      },
      animation: {
        'scan':       'scan 2.8s linear infinite',
        'fade-up':    'fadeUp 0.3s ease forwards',
        'blink':      'blink 1.4s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'bar-fill':   'barFill 0.6s ease forwards',
      },
      keyframes: {
        scan: {
          '0%':   { top: '0%',   opacity: '1'   },
          '95%':  { opacity: '0.7' },
          '100%': { top: '100%', opacity: '0'   },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)'   },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.15' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 12px rgba(139,92,246,0.2)' },
          '50%':     { boxShadow: '0 0 28px rgba(139,92,246,0.5), 0 0 48px rgba(34,211,238,0.15)' },
        },
        barFill: {
          from: { width: '0%' },
          to:   { width: 'var(--bar-w)' },
        },
      },
    },
  },
  plugins: [],
}
