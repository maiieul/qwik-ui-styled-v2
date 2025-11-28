import { Slot, component$ } from "@qwik.dev/core";
import { useContent, useDocumentHead } from "@qwik.dev/router";
import { DocsNavigation } from "~/components/sidebar/sidebar";
import { MDXProvider } from "~/components/mdx/provider";
import { components } from "~/components/mdx/components";
import { DashboardTableOfContents } from "~/components/toc/toc";
import Header from "~/components/header/header";
import { useMenuItems } from "~/hooks/use-menu-items";
import { horizontalLayout } from "./horizontal-layout.constant";

export default component$(() => {
  const { headings } = useContent();
  const { menuItemsGroups } = useMenuItems();

  const documentHead = useDocumentHead();

  return (
    <>
      <div class={[horizontalLayout, "fixed z-10"]}>
        <div />
        <div class="flex w-full items-center justify-center px-12 lg:px-16">
          <Header />
        </div>
        <div />
      </div>
      <div class="grid">
        <div class={horizontalLayout}>
          <DocsNavigation
            class="sticky top-0 mr-4 hidden h-[100vh] overflow-auto border-r shadow-[3px_1px] shadow-shadow lg:flex"
            linksGroups={menuItemsGroups}
          />
          <main class="px-6 py-8 pt-24 lg:px-12">
            <h1 class="mb-6 scroll-mt-24 pt-6 text-3xl font-extrabold md:text-5xl">
              {documentHead.title}
            </h1>
            <p class="mb-6 last:mb-0">
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
