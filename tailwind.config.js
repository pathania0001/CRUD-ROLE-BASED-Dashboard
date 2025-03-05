/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#ffffff",
        "text": "#000",
        "desc": "#7e7e7e",
        //  "primary-light":"#D6E8F7",
        "background": "#f2f2f3",
        "border": "#000"
      },
      fontFamily: {
        "lexend": ['Lexend', 'sans-serif']

      }
    },
  },
  plugins: [],
}
