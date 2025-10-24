/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */

const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/global.css",
};

export default config;
