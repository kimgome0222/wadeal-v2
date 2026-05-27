import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
        soft: "0 4px 24px rgba(17, 24, 39, 0.06)",
        card: "0 1px 3px rgba(17, 24, 39, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
