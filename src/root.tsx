import { component$, isDev, useStyles$ } from "@qwik.dev/core";
import { QwikRouterProvider, RouterOutlet } from "@qwik.dev/router";
import { RouterHead } from "./components/router-head/router-head";

import globalStyles from "./global.css?inline";

import { ThemeProvider } from "~/hooks/use-theme/provider";

export default component$(() => {
  useStyles$(globalStyles);
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikRouterProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <RouterHead />
      </head>
      <body lang="en">
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          themes={["light", "dark", "modern", "qwik"]}
          defaultTheme="light qwik"
        >
          <RouterOutlet />
        </ThemeProvider>
      </body>
    </QwikRouterProvider>
  );
});
