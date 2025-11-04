import { ContentMenu, useContent } from "@qwik.dev/router";

export interface LinkGroup {
  name: string;
  children: LinkProps[] | undefined;
}

export interface LinkProps {
  name: string;
  href?: string;
  new?: boolean;
}

export function useMenuItems() {
  const { menu } = useContent();
  let menuItemsGroups: LinkGroup[] | undefined = [];

  menuItemsGroups = decorateMenuItemsWithChips(menu?.items, ["Button"]);

  return { menuItemsGroups };
}

function decorateMenuItemsWithChips(
  menuItems: ContentMenu[] | undefined,
  newComponents: string[],
): LinkGroup[] | undefined {
  return menuItems?.map((item) => {
    return {
      name: item.text,
      children: item.items?.map((child) => {
        const link: LinkProps = {
          name: child.text,
          href: child.href,
        };
        if (newComponents.includes(child.text)) {
          link.new = true;
        }
        return link;
      }),
    };
  });
}
