module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', "sans-serif"]
      },
    },
  },
  darkMode: 'class',
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "#2F2E41",
          secondary: "#5F5AB4",
          "base-100": "#F0F0F0",
          "primary-content": "#FFFFFF",
          "--btn-text-case": "capitalize",
        },
      },
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: "#C27501",
          secondary: "#5F5AB4",
          "base-100": "#3F3D56",
          "primary-content": "#F1F1F1",
          "base-content": "#E6E6E6",
          "--btn-text-case": "capitalize",
        },
      },
    ],
  },
}
