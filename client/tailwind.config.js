/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4C9A6A',
          light: '#E8F5EC'
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#10231A'
        },
        surface: {
          DEFAULT: '#F4FAF6',
          dark: '#16281F'
        },
        text: {
          DEFAULT: '#1E2A22',
          dark: '#E7F3EC'
        },
        accent: '#A3D9B1'
      }
    },
  },
  plugins: [],
}
