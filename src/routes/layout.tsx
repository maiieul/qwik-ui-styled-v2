import { Slot, component$, useStyles$ } from "@qwik.dev/core";
import { useContent, useDocumentHead } from "@qwik.dev/router";
import { DocsNavigation } from "~/components/navigation-docs/navigation-docs";
import { MDXProvider } from "~/components/mdx/provider";
import { components } from "~/components/mdx/components";
import { DashboardTableOfContents } from "~/components/toc/toc";
import Header from "~/components/header/header";
import { useMenuItems } from "~/hooks/use-menu-items";

export default component$(() => {
  const { headings } = useContent();
  const { menuItemsGroups } = useMenuItems();

  const documentHead = useDocumentHead();

  const horizontalLayout =
    "grid h-12 w-full grid-cols-[minmax(0,1fr)] lg:grid-cols-[288px_minmax(0,1fr)] xl:grid-cols-[288px_minmax(0,968px)_240px] 2xl:gap-16";

  return (
    <>
      <div>
        <div class={[horizontalLayout, "fixed"]}>
          <div />
          <div class="flex w-full items-center justify-center px-12 lg:px-16">
            <Header />
          </div>
          <div />
        </div>

        <div class={[horizontalLayout, "grid"]}>
          <DocsNavigation
            class="mr-4 hidden overflow-auto border-r shadow-sm lg:block 2xl:ml-0"
            linksGroups={menuItemsGroups}
          />
          <main class="px-6 py-8 pt-24 lg:px-12">
            <h1 class="mb-6 scroll-mt-24 pt-6 text-3xl font-extrabold md:text-5xl">
              {documentHead.title}
            </h1>
            <p class="mb-6 text-muted-foreground last:mb-0">
              {documentHead.meta.find((m) => m.name === "description")?.content}
            </p>
            <MDXProvider components={components}>
              <Slot />
            </MDXProvider>
          </main>
          <div class="mx-6 hidden text-sm xl:block">
            <div class="fixed translate-y-[-20px] py-12">
              <div class="toc-scrollbar h-[calc(100vh-64px)] overflow-auto pr-6 pb-4 pb-16">
                <DashboardTableOfContents headings={headings ? headings : []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
