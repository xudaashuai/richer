/* eslint-disable */
const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: ['postcss-preset-env', tailwindcss, require('autoprefixer')],
  purge: {
    options: {
      safelist: [
        'bg-green-300',
        'bg-yellow-300',
        'bg-green-100',
        'bg-yellow-100',
        'bg-green-200',
        'bg-yellow-200'
      ]
    }
  }
};
