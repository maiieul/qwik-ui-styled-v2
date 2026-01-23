import { component$, useSignal, useVisibleTask$ } from "@qwik.dev/core";
import { Lucide, Tabs } from "@qds.dev/ui";
import { Highlight } from "../highlight/highlight";
import { useTheme } from "~/hooks/use-theme/provider";
import { extractThemedCSS } from "~/utils/extract-themed-css/extract-themed-css";
import { Button, IconButton } from "../ui";

export type rawSnippetTab = {
  title: string;
  code: string;
};

export type CodeSnippetsProps = {
  rawSnippetTabs: rawSnippetTab[];
  folderName: string;
};

export const CodeSnippets = component$<CodeSnippetsProps>(
  ({ rawSnippetTabs, folderName, ...props }) => {
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
      <div class="mb-12 overflow-hidden rounded-xl border shadow-md">
        <Tabs.Root {...props}>
          <div class="flex h-120 min-w-0">
            <Tabs.List class="w-52 shrink-0 border-r p-2">
              <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 py-2 pl-2 text-sm text-foreground-muted">
                    {folderName}
                  </div>
                  <IconButton variant="ghost" class="mr-3">
                    <Lucide.CloudDownload />
                  </IconButton>
                </div>
                {themedSnippetTabsSig.value.map(
                  (themedSnippetTab: rawSnippetTab) => {
                    return (
                      <Tabs.Trigger key={themedSnippetTab.title} asChild>
                        <Button
                          variant="ghost"
                          class="w-full justify-start text-foreground-muted hover:bg-background-accent hover:text-foreground-accent ui-selected:bg-background-emphasis ui-selected:text-foreground-emphasis"
                        >
                          <span class="mr-2">
                            {themedSnippetTab.title.split(".")[1] === "css" ? (
                              <Lucide.Hash />
                            ) : (
                              <Lucide.Code />
                            )}
                          </span>
                          <span class="truncate">{themedSnippetTab.title}</span>
                        </Button>
                      </Tabs.Trigger>
                    );
                  },
                )}
              </div>
            </Tabs.List>
            <div class="min-w-0 flex-1">
              {themedSnippetTabsSig.value.map(
                (themedSnippetTab: rawSnippetTab) => {
                  return (
                    <Tabs.Content
                      key={themedSnippetTab.title}
                      class="relative h-full"
                      style={{ backgroundColor: "#1b1e28", color: "#a6accd" }}
                    >
                      <Highlight
                        canBeCopied={false}
                        code={themedSnippetTab.code || ""}
                        language={
                          themedSnippetTab.title.split(".")[1] as "tsx" | "css"
                        }
                      />
                    </Tabs.Content>
                  );
                },
              )}
            </div>
          </div>
        </Tabs.Root>
      </div>
    );
  },
);
