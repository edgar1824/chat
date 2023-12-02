/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        lg: { max: "1000px" },
        md: { max: "770px" },
        sm: { max: "450px" },
      },
      backgroundImage: {
        slide:
          "linear-gradient(to right,rgba(255, 255, 255, 0) 0%,rgba(255, 255, 255, 0.8) 50%,rgba(128, 186, 232, 0) 99%,rgba(125, 185, 232, 0) 100%)",
      },
      boxShadow: {
        cst: "0px 0px 10px 5px rgb(0 0 0 / 10%)",
      },
      keyframes: {
        loading: {
          "0%, 35%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-3px)",
          },
          "65%": {
            transform: "translateY(0px)",
          },
        },
        "loading-light": {
          "0%, 35%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-1.5px)",
          },
          "65%": {
            transform: "translateY(0px)",
          },
        },
        slide: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "loading-1": "loading 2s cubic-bezier(0, 0, 0, 0) 0.2s infinite",
        "loading-2": "loading 2s cubic-bezier(0, 0, 0, 0) 0.4s infinite",
        "loading-3": "loading 2s cubic-bezier(0, 0, 0, 0) 0.6s infinite",
        "loading-1-light":
          "loading-light 2s cubic-bezier(0, 0, 0, 0) 0.2s infinite",
        "loading-2-light":
          "loading-light 2s cubic-bezier(0, 0, 0, 0) 0.4s infinite",
        "loading-3-light":
          "loading-light 2s cubic-bezier(0, 0, 0, 0) 0.6s infinite",
        slide: "slide 1s infinite 0s",
        "spin-fast": "spin 0.7s linear infinite",
      },
    },
  },
  plugins: [
    {
      tailwindcss: { config: "./tailwindcss-config.js" },
    },
  ],
};
