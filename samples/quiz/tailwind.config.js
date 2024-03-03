/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./**/*.{html,xml}", "./node_modules/arrmatura-ui*/**/*.xml"],
  safelist: [
    "text-2xl",
    "text-3xl",
    {
      pattern: /bg-(red|green|yellow|blue|gray|slate)-(300|500|600)/,
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
