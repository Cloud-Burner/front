// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed', // основной
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: '#f97316',
        background: '#f9fafb',
        dark: '#1f2937',
        muted: '#e5e7eb',
      },
    },
  },
  plugins: [],
}