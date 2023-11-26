import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        purple: "#633CFF",
        lightPurple: "#EFEBFF",
        purpleHover: "#BEADFF",
        gray: "#737373",
        lightGray: "#FAFAFA",
        borders: "#D9D9D9",
        dark: {
          gray: "#333333",
        },
        red: "#FF3939",
        white: "#FFFFFF",
      },
      boxShadow: {
        active: "0 0 32px 0 rgb(99 60 255 / 0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
