/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */

const config = {
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-css-order"],
  tailwindStylesheet: "./src/global.css",
};

export default config;
