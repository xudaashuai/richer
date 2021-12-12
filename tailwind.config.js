/* eslint-disable */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  safelist: ['green', 'yellow', 'red', 'purple', 'blue'].flatMap((color) =>
    new Array(9).fill(0).map((_, index) => `bg-${color}-${(index + 1) * 100}`)
  ),
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
};
