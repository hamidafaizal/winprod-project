/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'winprod-gray': '#040529',
        'winprod-dark-blue': '#0D194B',
        'winprod-blue': '#19386D',
        'winprod-medium-blue': '#2A6190',
        'winprod-light-blue': '#4091B2',
        'winprod-cyan': '#59C6D4',
        'winprod-light-cyan': '#77F7F0',
      }
    },
    fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
  },
  plugins: [],
}