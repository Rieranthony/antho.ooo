module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        dp: {
          24: "#383838",
          16: "#363636",
          12: "#333333",
          "08": "#2E2E2E",
          "06": "#2C2C2C",
          "04": "#272727",
          "02": "#232323",
          "01": "#1E1E1E",
          "00": "#000000",
          normal: "#FFFFFF",
          "high-emphasis": "#E0E0E0",
          "medium-emphasis": "#A0A0A0",
          disabled: "#6C6C6C"
        }
      }
    }
  },
  plugins: []
};
