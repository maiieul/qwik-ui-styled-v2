import { Slot, component$ } from "@qwik.dev/core";
import { useContent } from "@qwik.dev/router";
import { DocsNavigation } from "~/components/navigation-docs/navigation-docs";
import { MDXProvider } from "~/components/mdx/provider";
import { components } from "~/components/mdx/components";
import { DashboardTableOfContents } from "~/components/toc/toc";
import Header from "~/components/header/header";
import { useMenuItems } from "~/hooks/use-menu-items";

export default component$(() => {
  const { headings } = useContent();

  const { menuItemsGroups } = useMenuItems();

  return (
    <>
      <Header />
      <div class="grid justify-center">
        <div class="grid w-full grid-cols-[minmax(0,1fr)] lg:grid-cols-[288px_minmax(0,1fr)] xl:grid-cols-[288px_minmax(0,968px)_240px] 2xl:gap-16">
          <DocsNavigation
            class="sticky top-16 mr-4 hidden h-[calc(100vh-64px)] overflow-auto lg:block 2xl:ml-0"
            linksGroups={menuItemsGroups}
          />
          <MDXProvider components={components}>
            <main class="px-6 py-8 lg:px-12">
              <Slot />
            </main>
          </MDXProvider>
          <div class="mx-6 hidden text-sm xl:block">
            <div class="fixed translate-y-[-20px] py-12">
              <div class="toc-scrollbar mb-4 h-[calc(100vh-64px)] overflow-auto pr-6 pb-16">
                <DashboardTableOfContents headings={headings ? headings : []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
