/**
 * This is the base config for vite.
 * When building, the adapter config is used which loads this file and extends it.
 */
import { defineConfig, type UserConfig } from "vite";
import { qwikVite } from "@qwik.dev/core/optimizer";
import { qwikRouter } from "@qwik.dev/router/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import pkg from "./package.json";
import tailwindcss from "@tailwindcss/vite";
import { ShikiTransformer } from "shiki";
import { asChild, icons } from "@qds.dev/tools/vite";

type PkgDep = Record<string, string>;
const {
  dependencies = {},
  devDependencies = {},
} = pkg as any as {
  dependencies: PkgDep;
  devDependencies: PkgDep;
  [key: string]: unknown;
};
errorOnDuplicatesPkgDeps(devDependencies, dependencies);

const qwikLibs = ["maiieul-qwik-v2-lib", "@qds.dev/ui"]

// @ts-ignore
export default defineConfig(async (command: any, mode: any): Promise<UserConfig> => {
  const { default: shikiRehype } = await import("@shikijs/rehype");

  return {
    root: "./",
    plugins: [
      asChild(),
      icons(),
      qwikVite({
        lint: false,
        debug: false,
      }),
      qwikRouter({
        mdxPlugins: {
          rehypeSyntaxHighlight: false,
          remarkGfm: true,
          rehypeAutolinkHeadings: true,
        },
        mdx: {
          providerImportSource: "~/components/mdx/provider",
          rehypePlugins: [
            [
              shikiRehype,
              {
                theme: "poimandres",
                transformers: [transformerSourceAsPreProp()],
              },
            ],
          ],
        },
      }),

      tsconfigPaths({ root: "." }),
      tailwindcss(),

    ],
    optimizeDeps: {
      exclude: qwikLibs,
    },
    ssr: {
      noExternal: qwikLibs,
    },
    server: {
      headers: {
        // Don't cache the server response in dev mode
        "Cache-Control": "public, max-age=0",
      },
    },
    preview: {
      headers: {
        // Do cache the server response in preview (non-adapter production build)
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
// *** utils ***
/**
 * Function to identify duplicate dependencies and throw an error
 * @param {Object} devDependencies - List of development dependencies
 * @param {Object} dependencies - List of production dependencies
 */
function errorOnDuplicatesPkgDeps(
  devDependencies: PkgDep,
  dependencies: PkgDep,
) {
  let msg = "";
  // Create an array 'duplicateDeps' by filtering devDependencies.
  // If a dependency also exists in dependencies, it is considered a duplicate.
  const duplicateDeps = Object.keys(devDependencies).filter(
    (dep) => dependencies[dep],
  );
  // include any known qwik packages
  const qwikPkg = Object.keys(dependencies).filter((value) =>
    /qwik/i.test(value),
  );
  // any errors for missing "qwik-city-plan"
  // [PLUGIN_ERROR]: Invalid module "@qwik-router-config" is not a valid package
  msg = `Move qwik packages ${qwikPkg.join(", ")} to devDependencies`;
  if (qwikPkg.length > 0) {
    throw new Error(msg);
  }
  // Format the error message with the duplicates list.
  // The `join` function is used to represent the elements of the 'duplicateDeps' array as a comma-separated string.
  msg = `
    Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both "devDependencies" and "dependencies".
    Please move the duplicated dependencies to "devDependencies" only and remove it from "dependencies"
  `;
  // Throw an error with the constructed message.
  if (duplicateDeps.length > 0) {
    throw new Error(msg);
  }
}

function transformerSourceAsPreProp(): ShikiTransformer {
  return {
    pre(node) {
      node.properties.rawCodeString = this.source;
    },
  };
}
