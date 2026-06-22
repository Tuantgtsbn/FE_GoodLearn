export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html,css,scss,sass}'],
  safelist: [
    'text-indigo-600',
    'dark:text-indigo-400',
    'text-emerald-600',
    'dark:text-emerald-400',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
