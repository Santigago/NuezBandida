/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#f6f0ea',
          100: '#e9dccb',
          200: '#cfae86',
          300: '#b1875e',
          400: '#8a6242',
          500: '#6f4e37', // base
          600: '#5a3e2c',
          700: '#4b3621',
          800: '#3b2b1a',
          900: '#2a1e12',
        },
        burgundy: {
          50: '#fbebee',
          100: '#f0c3cd',
          200: '#d98c9d',
          300: '#b85068',
          400: '#8c1c3f',
          500: '#6d071a', // base
          600: '#590515',
          700: '#450410',
          800: '#33030c',
          900: '#210208',
        },
        cream: '#f7efe4',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
