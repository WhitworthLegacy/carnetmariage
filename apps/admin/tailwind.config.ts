import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF9F7",
        "pink-light": "#FCE7F3",
        "pink-main": "#D8A7B1",
        "pink-dark": "#9D174D",
        "purple-light": "#EDE9FE",
        "purple-main": "#A78BFA",
        "purple-dark": "#5B21B6",
        ink: "#1f1f1f",
        muted: "#6b7280",
        "muted-light": "#9ca3af",
        "brand-primary": "#A78BFA",
        "brand-accent": "#D8A7B1",
        "brand-dark": "#1f1f1f",
        "brand-muted": "#6b7280",
        "brand-surface": "#FAF9F7",
        "brand-border": "#e5e7eb",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(167, 139, 250, 0.15)",
        card: "0 4px 12px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
