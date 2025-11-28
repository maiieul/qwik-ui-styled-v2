import { PropsOf, component$, useStyles$ } from "@qwik.dev/core";
import { Link, useLocation } from "@qwik.dev/router";
import { Chip } from "../ui";
import sidebarStyles from "./sidebar.css?inline";

export interface LinkGroup {
  name: string;
  children: LinkProps[] | undefined;
}

export interface LinkProps {
  name: string;
  href?: string;
  new?: boolean;
}

export type DocsNavigationProps = PropsOf<"nav"> & {
  linksGroups?: LinkGroup[];
  isSidebarOpenedSig?: boolean;
};

const defaultLinksGroups: LinkGroup[] = [
  {
    name: "Qwik UI",
    children: [
      {
        name: "Getting started",
        href: "/docs/getting-started/",
      },
    ],
  },
];

export const DocsNavigation = component$(
  ({ linksGroups = defaultLinksGroups, ...props }: DocsNavigationProps) => {
    const location = useLocation();
    useStyles$(sidebarStyles);
    return (
      <nav
        {...props}
        class={["flex-col gap-4 bg-white pb-6 dark:bg-black", props.class]}
      >
        {linksGroups?.map((group) => {
          return (
            <div class="px-6 pt-8" key={group.name}>
              <h2 class="mb-2 border-b-2 p-2 text-lg font-medium">
                {group.name}
              </h2>
              <ul class="flex flex-col gap-2">
                {group.children?.map((link) => {
                  const isLinkActive = location.url.pathname === link.href;

                  return (
                    <li key={link.name + link.href}>
                      <Link
                        href={link.href}
                        class={[
                          "btn size-md sidebar-link",
                          isLinkActive
                            ? "text bg-accent text-accent-foreground"
                            : "",
                        ]}
                      >
                        <div class="flex w-full items-center justify-between">
                          <span>{link.name}</span>
                          {link.new && (
                            <Chip variant="alt-primary" class="ml-2">
                              New
                            </Chip>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    );
  },
);
