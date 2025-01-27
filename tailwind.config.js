/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "bgHome" : "url('src/assets/image/MhooJuum.png')"
      },
      fontFamily: {
        Muffin: ['Muffin']
      }
    },
  },
  plugins: [],
}