/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: "#E8F3FF",
          100: "#B9D8FF",
          200: "#8ABDFF",
          300: "#5BA2FF",
          400: "#2C87FF",
          500: "#165DFF",
          600: "#0E42D2",
          700: "#0A2BA0",
          800: "#061A6E",
          900: "#030D3C",
        },
        warning: {
          50: "#FFECE8",
          100: "#FFCDC4",
          200: "#FFADA0",
          300: "#FF8E7C",
          400: "#FF6E58",
          500: "#F53F3F",
          600: "#CB2634",
          700: "#A11228",
          800: "#77051A",
          900: "#4D000C",
        },
        success: {
          500: "#00B42A",
        },
      },
      fontFamily: {
        display: ["SF Pro Display", "-apple-system", "sans-serif"],
        body: ["SF Pro Text", "-apple-system", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "breathe": "breathe 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
