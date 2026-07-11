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
        rss: {
          red: '#e5232d',
          'red-dim': '#8f1519',
          gold: '#c9a227',
          dark: '#050505',
          panel: '#0c0c0cf2',
          line: '#222222',
          grey: '#6b6b6b',
          white: '#eaeaea',
        },
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'Cascadia Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scanShift 0.45s steps(2) infinite',
        'flicker': 'flick 1.2s steps(1) forwards',
        'blink': 'blink 1.05s steps(1) infinite',
        'glitch': 'glitch 0.8s steps(1)',
        'phosphor': 'phosphor 0.11s steps(2) infinite',
        'logo-in': 'logoIn 0.45s steps(6) forwards',
      },
      keyframes: {
        scanShift: {
          '50%': { transform: 'translateY(1px)' },
        },
        flick: {
          '0%,3%': { opacity: '1' },
          '4%': { opacity: '.78' },
          '5%,38%': { opacity: '1' },
          '39%': { opacity: '.85' },
          '40%,71%': { opacity: '1' },
          '72%': { opacity: '.7' },
          '73%,100%': { opacity: '1' },
        },
        blink: {
          '50%': { opacity: '0' },
        },
        glitch: {
          '0%,100%': { clipPath: 'none', transform: 'none' },
          '6%': { clipPath: 'inset(12% 0 64% 0)', transform: 'translateX(-7px)' },
          '8%': { clipPath: 'none', transform: 'none' },
          '23%': { clipPath: 'inset(58% 0 18% 0)', transform: 'translateX(6px)' },
          '25%': { clipPath: 'none', transform: 'none' },
          '47%': { clipPath: 'inset(30% 0 40% 0)', transform: 'translateX(-4px) scaleY(1.02)' },
          '49%': { clipPath: 'none', transform: 'none' },
          '72%': { clipPath: 'inset(80% 0 4% 0)', transform: 'translateX(9px)' },
          '74%': { clipPath: 'none', transform: 'none' },
        },
        phosphor: {
          '50%': { filter: 'drop-shadow(0 0 26px rgba(229,35,45,.7)) drop-shadow(0 0 5px rgba(255,255,255,.35)) brightness(1.14)' },
        },
        logoIn: {
          from: { opacity: '0', transform: 'scale(1.06)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}