/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'sudoku': 'repeat(9, minmax(40px, 1fr))',
      },
      backgroundColor: {
        'cell-initial': '#e0e0e0',
        'cell-empty': '#ffffff',
      },
      fontFamily: {
        'great-vibes': ['Great Vibes', 'cursive'],
        'playfair': ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
} 