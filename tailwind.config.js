/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f8fa',
          100: '#eceef2',
          200: '#d5dae3',
          300: '#b0bac9',
          400: '#8594ab',
          500: '#667892',
          600: '#516079',
          700: '#434e63',
          800: '#3a4254',
          900: '#1e2433',
          950: '#121722',
        },
        accent: {
          DEFAULT: '#3d7a6b',
          muted: '#2f5f54',
        },
      },
      boxShadow: {
        card: '0 4px 24px -4px rgba(18, 23, 34, 0.12), 0 2px 8px -2px rgba(18, 23, 34, 0.08)',
        'card-hover': '0 12px 40px -8px rgba(18, 23, 34, 0.18), 0 4px 12px -4px rgba(18, 23, 34, 0.1)',
      },
    },
  },
  plugins: [],
}
