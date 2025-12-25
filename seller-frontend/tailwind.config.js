/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff7e29', // orange
        dark: '#0f0f0f',
        light: '#ffffff',
        grayText: '#d1d5db',
      }
    },
  },
  plugins: [],
};

