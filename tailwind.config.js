module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "#2F2E41",
          "primary-content": "#FFFFFF",
          "--btn-text-case": "capitalize",
        },
      },
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: "#C27501",
          "primary-content": "#F1F1F1",
          "base-content": "#E6E6E6",
          "--btn-text-case": "capitalize",
        },
      },
    ],
  },
}
