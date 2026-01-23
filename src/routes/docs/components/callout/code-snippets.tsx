import { component$ } from "@qwik.dev/core";
import { CodeSnippets } from "~/components/mdx/code-snippets";
import CalloutRootRawCode from "~/components/ui/callout/callout-root.tsx?raw";
import CalloutRootCssRawCode from "~/components/ui/callout/callout-root.css?raw";

import CalloutTitleRawCode from "~/components/ui/callout/callout-title.tsx?raw";
import CalloutTitleCssRawCode from "~/components/ui/callout/callout-title.css?raw";

import CalloutDescriptionRawCode from "~/components/ui/callout/callout-description.tsx?raw";
import CalloutDescriptionCssRawCode from "~/components/ui/callout/callout-description.css?raw";

import indexTsxRawCode from "~/components/ui/callout/index.tsx?raw";

export const CalloutCodeSnippets = component$(() => {
  return (
    <>
      <CodeSnippets
        folderName="Callout"
        rawSnippetTabs={[
          {
            title: "Root.tsx",
            code: CalloutRootRawCode,
          },
          {
            title: "Root.css",
            code: CalloutRootCssRawCode,
          },
          {
            title: "Title.tsx",
            code: CalloutTitleRawCode,
          },
          {
            title: "Title.css",
            code: CalloutTitleCssRawCode,
          },
          {
            title: "Description.tsx",
            code: CalloutDescriptionRawCode,
          },
          {
            title: "Description.css",
            code: CalloutDescriptionCssRawCode,
          },
          {
            title: "index.tsx",
            code: indexTsxRawCode,
          },
        ]}
      />
    </>
  );
});
