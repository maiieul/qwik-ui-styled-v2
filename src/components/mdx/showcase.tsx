import { component$, Slot } from "@qwik.dev/core";
import { tabs } from "@qds.dev/ui";
import { Highlight } from "../highlight/highlight";

type ShowcaseProps = {
  rawCode: string;
};

export const Showcase = component$<ShowcaseProps>(({ rawCode, ...props }) => {
  return (
    <tabs.root {...props}>
      <tabs.list class="flex">
        <tabs.trigger class="h-10 px-3 py-2 font-medium text-foreground-muted hover:text-foreground-accent ui-selected:text-foreground-emphasis">
          Preview
        </tabs.trigger>
        <tabs.trigger class="h-10 px-3 py-2 font-medium text-foreground-muted hover:text-foreground-accent ui-selected:text-foreground-emphasis">
          Code
        </tabs.trigger>
      </tabs.list>
      <tabs.content class="mb-16 h-120 rounded-xl border px-8 py-32 shadow-md md:px-32">
        <section class="flex h-full flex-col items-center justify-center">
          <Slot />
        </section>
      </tabs.content>
      <tabs.content class="relative mb-16 h-120 rounded-xl border bg-(--shiki-light-bg) p-2 shadow-md dark:bg-(--shiki-dark-bg)">
        <Highlight class="rounded-t-none" code={rawCode || ""} />
      </tabs.content>
    </tabs.root>
  );
});
