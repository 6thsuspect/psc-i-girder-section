/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b1018',
          900: '#121821',
          800: '#1a2330',
          700: '#243044',
          600: '#31405a',
          400: '#7d8aa0',
          300: '#a8b3c4',
          200: '#d5dbe6',
        },
        brass: {
          400: '#e2b56a',
          500: '#c9963a',
          600: '#a67728',
        },
        paper: {
          50: '#f7f4ec',
          100: '#efe9da',
          200: '#e2d8c2',
        },
        cad: {
          dim: '#0e6e8c',
          line: '#1f2a36',
          hatch: '#8d8270',
        },
      },
      fontFamily: {
        sans: ['Barlow', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        cond: ['Barlow Condensed', 'Barlow', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        sheet: '0 24px 60px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
      },
    },
  },
  plugins: [],
};
