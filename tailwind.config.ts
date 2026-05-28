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
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "sans-serif",
        ],
      },
      colors: {
        wadeal: {
          red: "#e53935",
          coral: "#ff6b4a",
          ink: "#111827",
          muted: "#6b7280",
          line: "#e5e7eb",
          surface: "#f7f8fa",
          kakao: "#fee500",
        },
      },
      boxShadow: {
        soft: "0 8px 24px rgba(17, 24, 39, 0.08)",
        card: "0 1px 4px rgba(17, 24, 39, 0.06)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.88" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
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
