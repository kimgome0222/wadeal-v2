import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Noto Sans KR",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Apple SD Gothic Neo",
          "sans-serif",
        ],
      },
      colors: {
        wadeal: {
          red: "#2E5E4E",
          "red-deep": "#244C3F",
          coral: "#E28A3B",
          ink: "#111111",
          muted: "#666666",
          line: "#E8ECEA",
          surface: "#F5F7F6",
          sage: "#F5F7F6",
          cream: "#FFF8EF",
          kakao: "#fee500",
          tabInactive: "#999999",
        },
      },
      boxShadow: {
        soft: "0 8px 24px rgba(31, 42, 36, 0.08)",
        card: "0 1px 3px rgba(31, 42, 36, 0.06)",
        "card-hover": "0 6px 20px rgba(46, 94, 78, 0.12)",
        lift: "0 10px 28px rgba(46, 94, 78, 0.14)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.88" },
        },
        "celloh-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "celloh-fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "celloh-slide-in": {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "celloh-banner-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "celloh-modal-in": {
          from: { opacity: "0", transform: "translateY(6px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "celloh-drawer-in": {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "celloh-backdrop-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "celloh-fade-in": "celloh-fade-in 0.3s ease-out both",
        "celloh-fade-in-up": "celloh-fade-in-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        "celloh-slide-in": "celloh-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "celloh-banner-in": "celloh-banner-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
        "celloh-modal-in": "celloh-modal-in 0.28s cubic-bezier(0.16, 1, 0.3, 1) both",
        "celloh-drawer-in": "celloh-drawer-in 0.32s cubic-bezier(0.16, 1, 0.3, 1) both",
        "celloh-backdrop-in": "celloh-backdrop-in 0.22s ease-out both",
      },
      animationDelay: {
        75: "75ms",
        150: "150ms",
        225: "225ms",
        300: "300ms",
      },
      borderRadius: {
        xl: "12px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
