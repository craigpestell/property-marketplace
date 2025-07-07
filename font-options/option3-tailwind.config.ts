import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        primary: ['Montserrat', ...defaultTheme.fontFamily.sans],
        heading: ['Cormorant Garamond', ...defaultTheme.fontFamily.serif],
      },
      // Rest of your theme configuration remains the same
    },
  },
  // Rest of your Tailwind config remains the same
} as Config;
