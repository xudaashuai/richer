/* eslint-disable */
const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: ['postcss-preset-env', tailwindcss, require('autoprefixer')],
  purge: {
    options: {
      safelist: [/bg-/]
    }
  }
};
