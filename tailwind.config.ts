import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        court: {
          DEFAULT: "#2e7d32",
          dark: "#1b5e20",
          line: "#f5f5f4",
          clay: "#c06636",
          grass: "#4ea84e",
        },
        ball: {
          DEFAULT: "#d4ff3a",
          glow: "#ecff7a",
        },
        ink: {
          DEFAULT: "#0a0f0a",
          soft: "#0f1a13",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(212,255,58,0.55)",
        "glow-lg": "0 0 80px -10px rgba(212,255,58,0.55)",
      },
      keyframes: {
        "bounce-ball": {
          "0%,100%": { transform: "translateY(0) scale(1,1)" },
          "45%": { transform: "translateY(-60%) scale(0.95,1.08)" },
          "50%": { transform: "translateY(-62%) scale(1,1)" },
          "95%": { transform: "translateY(0) scale(1.12,0.9)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "bounce-ball": "bounce-ball 1.6s cubic-bezier(.6,0,.4,1) infinite",
        shimmer: "shimmer 3s linear infinite",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
      backgroundImage: {
        "grid-lines":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
