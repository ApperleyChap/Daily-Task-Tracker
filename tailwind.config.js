/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff',
          dark: '#1a1a1a'
        },
        surface: {
          light: '#f3f4f6',
          dark: '#2d2d2d'
        }
      }
    },
  },
  plugins: [],
};
