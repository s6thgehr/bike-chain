module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    styled: true,
    // TODO: Theme needs works
    themes: [
      {
        solana: {
          /* your theme name */
          fontFamily: {
            display: ["PT Mono, monospace"],
            body: ["Inter, sans-serif"],
          },
          primary: "#93254f" /* Primary color */,
          "primary-focus": "#722142" /* Primary color - focused */,
          "primary-content":
            "#f9fafb" /* Foreground content color to use on primary color */,

          secondary: "#587792" /* Secondary color */,
          "secondary-focus": "#4d6880" /* Secondary color - focused */,
          "secondary-content":
            "#f9fafb" /* Foreground content color to use on secondary color */,

          accent: "#f9dec9" /* Accent color */,
          "accent-focus": "#f7d2b6" /* Accent color - focused */,
          "accent-content":
            "#2b2b2b" /* Foreground content color to use on accent color */,

          neutral: "#2b2b2b" /* Neutral color */,
          "neutral-focus": "#2a2e37" /* Neutral color - focused */,
          "neutral-content":
            "#ffffff" /* Foreground content color to use on neutral color */,

          "base-100":
            "#f9fafb" /* Base color of page, used for blank backgrounds */,
          "base-200": "#f9fafb" /* Base color, a little darker */,
          "base-300": "#f9fafb" /* Base color, even more darker */,
          "base-content":
            "#2b2b2b" /* Foreground content color to use on base color */,

          info: "#2094f3" /* Info */,
          success: "#009485" /* Success */,
          warning: "#ff9900" /* Warning */,
          error: "#ff5724" /* Error */,
        },
      },
      // backup themes:
      // 'dark',
      // 'synthwave'
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
