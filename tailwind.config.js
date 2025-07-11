/* eslint-disable @typescript-eslint/no-require-imports */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "theme-bg-color": "#242024",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
