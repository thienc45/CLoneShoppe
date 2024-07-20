const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {
      colors: {
        orange: '#ee4d2d',
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('spacing.7xl'), // chỉnh sửa đúng theme của bạn
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4'),
        },
        // '.line-clamp-2': {
        //   display: '-webkit-box',
        //   '-webkit-line-clamp': '2',
        //   '-webkit-box-orient': 'vertical',
        //   overflow: 'hidden',
        // },
      });
    }),
  ],
};
