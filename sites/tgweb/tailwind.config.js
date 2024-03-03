/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./**/*.{html,js,xml}", "./node_modules/arrmatura-ui*/**/*.xml"],
  safelist: [
    "text-2xl",
    "text-3xl",
    {
      pattern: /bg-(red|green|yellow|blue|gray)-(500)/,
    },
    {
      pattern: /(-|)rotate-90/,
    },
  ],
  theme: {
    extend: {
      colors: {
        active: "#86198f",
      },
    },
  },
};
