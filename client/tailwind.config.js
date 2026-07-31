/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Fraunces"', '"Noto Serif Malayalam"', 'serif'],
        sans: ['"Instrument Sans"', '"Baloo Chettan 2"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2F6B47', // deep forest green — logo, buttons, links
          hover: '#25583A',
          light: '#E8F5EC',   // pale mint — badges, icon chips in light mode
        },
        background: {
          DEFAULT: '#F8F6F0', // warm cream
          dark: '#0B1E14',    // near-black green
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#FFFFFF',
          dark: '#16281F',    // card bg in dark mode
        },
        band: {
          // the "Curated Reads" strip — stays dark green in BOTH themes
          DEFAULT: '#122E1D',
          dark: '#0A1910',
        },
        text: {
          DEFAULT: '#1B2B22',
          secondary: '#5B6B60',
          dark: '#EAF4EE',
          'secondary-dark': '#9DB3A6',
        },
        accent: '#A3D9B1',
        border: {
          DEFAULT: '#E3E7E0',
          dark: '#24392C',
        },
      },
    },
  },
  plugins: [],
}