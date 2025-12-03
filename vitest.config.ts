import { qwikVite } from "@qwik.dev/core/optimizer";
import { playwright } from "@vitest/browser-playwright";
import {
  defineConfig,
  type TestProjectConfiguration,
  type CoverageOptions,
} from "vitest/config";
import tailwindcss from "@tailwindcss/vite";

const coverage: CoverageOptions = {
  provider: "istanbul",
  reporter: ["text", "json-summary", "lcov", "html"],
  reportsDirectory: "./coverage",
  include: ["src/**/*.{ts,tsx}"],
  exclude: [
    "src/entry.*",
    "src/root.tsx",
    "src/routes/**",
    "src/**/*.css",
    "src/**/*.d.ts",
    "src/test-setup.ts",
    "dist/**",
    "node_modules/**",
    "**/*.config.*",
  ],
};

const unitConfig: TestProjectConfiguration = {
  test: {
    include: ["**/*.unit.ts"],
    name: "unit",
    environment: "node",
    coverage,
  },
};

const domConfig: TestProjectConfiguration = {
  plugins: [
    qwikVite({
      srcDir: "src",
    }),
    tailwindcss(),
  ],
  test: {
    fileParallelism: false,
    include: ["**/*.browser.ts", "**/*.browser.tsx"],
    name: "dom",
    testTimeout: 2000,
    setupFiles: ["./src/test-setup.ts"],
    browser: {
      provider: playwright(),
      enabled: true,
      instances: [{ browser: "chromium" }],
    },
    coverage,
  },
};

export default defineConfig({
  resolve: {
    // alias: {
    //   "@qds.dev/utils": resolve(__dirname, "libs/utils/src"),
    //   "@qds.dev/ui": resolve(__dirname, "libs/components/src"),
    // },
  },
  test: {
    projects: [unitConfig, domConfig],
  },
});
