import { component$, Slot } from "@qwik.dev/core";
import { Tabs } from "@qds.dev/ui";
import { Highlight } from "../highlight/highlight";

type ShowcaseProps = {
  vertical?: boolean;
  rawCode: string;
};

export const Showcase = component$<ShowcaseProps>(({ rawCode, ...props }) => {
  return (
    <div class="mb-12 rounded-xl shadow-lg">
      <Tabs.Root
        {...props}
        selectedClassName="bg-primary hover:bg-primary text-primary-foreground hover:text-primary-foreground font-medium"
      >
        <Tabs.List class="bg-accent flex rounded-t-lg border border-b-0">
          <Tabs.Trigger class="hover:bg-primary/90 hover:text-primary-foreground h-[44px] rounded-tl-md px-3 py-2">
            Preview
          </Tabs.Trigger>
          <Tabs.Trigger class="hover:bg-primary/90 hover:text-primary-foreground h-[44px] px-3 py-2">
            Code
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content class="h-120 rounded-b-md border px-8 py-32 md:px-32">
          <section class="flex h-full flex-col items-center justify-center">
            <Slot />
          </section>
        </Tabs.Content>
        <Tabs.Content
          class="relative h-120 rounded-b-md border"
          style={{ backgroundColor: "#1b1e28", color: "#a6accd" }}
        >
          <Highlight class="rounded-t-none" code={rawCode || ""} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
});
