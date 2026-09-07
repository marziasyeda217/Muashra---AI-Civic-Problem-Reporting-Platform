/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0b132b',
          900: '#1c2541',
          800: '#1e2d4a',
          700: '#253a5e',
          600: '#3a506b',
          500: '#475569',
        },
        accent: {
          blue: '#2563eb',
          blueDark: '#1d4ed8',
          emerald: '#10b981',
          emeraldDark: '#059669',
          amber: '#f59e0b',
          amberDark: '#d97706',
          rose: '#f43f5e',
        },
        pakGreen: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        }
      }
    },
  },
  plugins: [],
}
