import { component$, Slot } from "@qwik.dev/core";
import { Tabs } from "@qds.dev/ui";
import { Highlight } from "../highlight/highlight";

type ShowcaseProps = {
  rawCode: string;
};

export const Showcase = component$<ShowcaseProps>(({ rawCode, ...props }) => {
  return (
    <Tabs.Root
      {...props}
      selectedClassName="bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground font-medium"
    >
      <Tabs.List class="flex">
        <Tabs.Trigger class="h-10 px-3 py-2 text-muted-foreground data-selected:text-foreground">
          Preview
        </Tabs.Trigger>
        <Tabs.Trigger class="h-10 px-3 py-2 text-muted-foreground data-selected:text-foreground">
          Code
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content class="mb-16 h-120 rounded-xl border px-8 py-32 shadow-lg md:px-32">
        <section class="flex h-full flex-col items-center justify-center">
          <Slot />
        </section>
      </Tabs.Content>
      <Tabs.Content
        class="relative mb-16 h-120 rounded-sm border p-2 shadow-lg"
        style={{
          backgroundColor: "#1b1e28",
          color: "#a6accd",
          // padding: "2px",
        }}
      >
        <Highlight class="rounded-t-none" code={rawCode || ""} />
      </Tabs.Content>
    </Tabs.Root>
  );
});
