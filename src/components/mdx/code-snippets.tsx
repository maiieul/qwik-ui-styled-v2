import { component$ } from "@qwik.dev/core";
import { Tabs } from "@qds.dev/ui";
import { Highlight } from "../highlight/highlight";

export type rawSnippetTab = {
  title: string;
  code: string;
};

export type CodeSnippetsProps = {
  rawSnippetTabs: rawSnippetTab[];
};

export const CodeSnippets = component$<CodeSnippetsProps>(
  ({ rawSnippetTabs, ...props }) => {
    return (
      <div class="mb-12 rounded-xl">
        <Tabs.Root
          {...props}
          selectedClassName="bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground font-medium"
        >
          <Tabs.List class="flex">
            {rawSnippetTabs.map((rawSnippetTab: rawSnippetTab) => {
              return (
                <Tabs.Trigger
                  key={rawSnippetTab.title}
                  class="text-muted-foreground data-selected:text-foreground h-[44px] px-3 py-2"
                >
                  {rawSnippetTab.title}
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>
          {rawSnippetTabs.map((rawSnippetTab: rawSnippetTab) => {
            return (
              <Tabs.Content
                key={rawSnippetTab.title}
                class="relative h-120 rounded-lg border"
                style={{ backgroundColor: "#1b1e28", color: "#a6accd" }}
              >
                <Highlight
                  class=""
                  code={rawSnippetTab.code || ""}
                  language={rawSnippetTab.title.split(".")[1] as "tsx" | "css"}
                />
              </Tabs.Content>
            );
          })}
        </Tabs.Root>
      </div>
    );
  },
);
