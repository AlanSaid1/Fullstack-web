import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customCyan: '#00BFA6',
      },
    },
  },
  plugins: [],
};

export default config;
