/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        santic: {
          red: "#d70c19",
          hoverRed: "#b80914",
          dark: "#161616",
          grey: "#1a1a1a",
          cardBg: "#f7f7f8",
          subtle: "#888888",
          border: "#e5e5e5"
        },
        grey: "#161616",
        white70: "rgba(255, 255, 255, 0.7)"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      }
    },
  },
  plugins: [],
}
