/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/index.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        MontserBarlowCondensed: ["Barlow Condensed", "Montserrat", "sans-serif"],
        lato: ["Lustria", "serif", "Lato", "sans-serif"],
        time: ["Platypi", 'serif']
      },
      animation: {
        slidein300: 'slidein 1s ease 300ms forwards',
        slidein500: 'slidein 1s ease 500ms forwards',
        slidein700: 'slidein 1s ease 700ms forwards',

      },
      keyframes: {
        slidein: {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          }
        }
      }
    },
    
  },
  plugins: [],
};
