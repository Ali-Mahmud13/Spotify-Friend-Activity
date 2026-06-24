import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        vibe: {
          cyan: "#67E8F9",
          blue: "#60A5FA",
          violet: "#8B5CF6",
          purple: "#A855F7",
          dark: "#050816",
          panel: "#111936"
        },
        spotify: {
          green: "#67E8F9",
          dark: "#050816",
          panel: "#111936",
          soft: "#172554"
        }
      },
      boxShadow: {
        glow: "0 0 42px rgba(96, 165, 250, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
