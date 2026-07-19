import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.6)",
          "light-strong": "rgba(255, 255, 255, 0.8)",
          "light-subtle": "rgba(255, 255, 255, 0.3)",
          dark: "rgba(17, 24, 39, 0.4)",
          "dark-strong": "rgba(17, 24, 39, 0.6)",
          "dark-subtle": "rgba(17, 24, 39, 0.2)",
          border: "rgba(255, 255, 255, 0.3)",
          "border-dark": "rgba(255, 255, 255, 0.1)",
          highlight: "rgba(255, 255, 255, 0.5)",
          "highlight-dark": "rgba(255, 255, 255, 0.15)",
        },
      },
      backdropBlur: {
        glass: "40px",
        "glass-lg": "64px",
        "glass-xl": "80px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.08)",
        "glass-lg": "0 12px 48px rgba(0, 0, 0, 0.12)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.25)",
        "glass-dark-lg": "0 12px 48px rgba(0, 0, 0, 0.35)",
        "glass-inset": "inset 0 1px 1px rgba(255, 255, 255, 0.4)",
        "glass-inset-dark": "inset 0 1px 1px rgba(255, 255, 255, 0.08)",
        "glass-glow-green": "0 0 20px rgba(34, 197, 94, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.2s ease-in-out",
        "glass-shimmer": "glassShimmer 3s ease-in-out infinite",
        "light-sweep": "lightSweep 2.5s ease-in-out infinite",
        "refraction-move": "refractionMove 6s ease-in-out infinite",
        "float-gentle": "floatGentle 4s ease-in-out infinite",
        "float-slow": "floatSlow 5s ease-in-out infinite",
        "float-medium": "floatMedium 3.5s ease-in-out infinite",
        "float-fast": "floatFast 3s ease-in-out infinite",
        "stroke-draw": "strokeDraw 1s ease-out 0.5s forwards",
        "check-draw": "checkDraw 1s ease-out 0.3s both",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
        "pulse-medium": "pulseMedium 3s ease-in-out infinite",
        "dash": "dashAnim 2s linear infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out both",
        "glass-card-entrance": "glassCardEntrance 0.5s ease-out both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        glassShimmer: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        lightSweep: {
          "0%": { transform: "translateX(-100%) skewX(-15deg)" },
          "100%": { transform: "translateX(300%) skewX(-15deg)" },
        },
        refractionMove: {
          "0%, 100%": { transform: "translateX(-20%) rotate(-5deg)", opacity: "0.3" },
          "50%": { transform: "translateX(20%) rotate(5deg)", opacity: "0.6" },
        },
        floatGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        floatMedium: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatFast: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        strokeDraw: {
          "0%": { strokeDashoffset: "30" },
          "100%": { strokeDashoffset: "0" },
        },
        checkDraw: {
          "0%, 20%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.1)" },
        },
        pulseMedium: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.15)" },
        },
        dashAnim: {
          "0%": { strokeDashoffset: "20" },
          "100%": { strokeDashoffset: "0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glassCardEntrance: {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
