import { component$, useSignal, useVisibleTask$ } from "@qwik.dev/core";
import { Tabs } from "@qds.dev/ui";
import { Highlight } from "../highlight/highlight";
import { useTheme } from "~/hooks/use-theme/provider";
import { extractThemedCSS } from "~/utils/extract-themed-css/extract-themed-css";

export type rawSnippetTab = {
  title: string;
  code: string;
};

export type CodeSnippetsProps = {
  rawSnippetTabs: rawSnippetTab[];
};

export const CodeSnippets = component$<CodeSnippetsProps>(
  ({ rawSnippetTabs, ...props }) => {
    const { themeSig } = useTheme();

    const themedSnippetTabsSig = useSignal<rawSnippetTab[]>([]);

    useVisibleTask$(async ({ track }) => {
      track(() => themeSig.value);

      const themedSnippetTabs = await Promise.all(
        rawSnippetTabs.map(async (rawSnippetTab: rawSnippetTab) => {
          return {
            title: rawSnippetTab.title,
            code: rawSnippetTab.title.endsWith(".css")
              ? await extractThemedCSS(rawSnippetTab.code, themeSig.value!)
              : rawSnippetTab.code,
          };
        }),
      );

      themedSnippetTabsSig.value = themedSnippetTabs;
    });

    return (
      <div class="mb-12 rounded-xl">
        <Tabs.Root {...props}>
          <Tabs.List class="flex">
            {themedSnippetTabsSig.value.map(
              (themedSnippetTab: rawSnippetTab) => {
                return (
                  <Tabs.Trigger
                    key={themedSnippetTab.title}
                    class="h-[44px] px-3 py-2 font-medium text-foreground-muted hover:text-foreground-emphasis ui-selected:text-foreground-emphasis"
                  >
                    {themedSnippetTab.title}
                  </Tabs.Trigger>
                );
              },
            )}
          </Tabs.List>
          {themedSnippetTabsSig.value.map((themedSnippetTab: rawSnippetTab) => {
            return (
              <Tabs.Content
                key={themedSnippetTab.title}
                class="relative h-120 rounded-lg border shadow-md"
                style={{ backgroundColor: "#1b1e28", color: "#a6accd" }}
              >
                <Highlight
                  class=""
                  code={themedSnippetTab.code || ""}
                  language={
                    themedSnippetTab.title.split(".")[1] as "tsx" | "css"
                  }
                />
              </Tabs.Content>
            );
          })}
        </Tabs.Root>
      </div>
    );
  },
);
