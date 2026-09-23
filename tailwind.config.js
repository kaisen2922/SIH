/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060a17',
          900: '#0b1329',
          850: '#111b36',
          800: '#182445',
          700: '#23325c',
          600: '#334677',
        },
        surface: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          hover: '#334155',
        },
        brand: {
          blue: '#2563eb',
          cyan: '#0891b2',
          teal: '#0d9488',
        },
        risk: {
          low: '#10b981',
          moderate: '#eab308',
          high: '#f97316',
          critical: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
