import { PropsOf, component$ } from "@qwik.dev/core";
import { Link, useLocation } from "@qwik.dev/router";
import { Badge } from "../ui";

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

    return (
      <nav {...props} class={["flex-col gap-4 pb-6", props.class]}>
        {linksGroups?.map((group) => {
          return (
            <div class="px-6 pt-8" key={group.name}>
              <h2 class="mb-2 border-b-2 p-2 text-lg font-bold">
                {group.name}
              </h2>
              <ul class="flex flex-col gap-2">
                {group.children?.map((link) => {
                  const isLinkActive = location.url.pathname === link.href;
                  return (
                    <li key={link.name + link.href}>
                      <Link
                        href={link.href}
                        // TODO: use the future sidebar component's button
                        // @ts-expect-error - size is not a valid prop for Link but it styles the button look
                        size="md"
                        class={[
                          "btn rounded-lg hover:bg-accent",
                          isLinkActive ||
                          (location.url.pathname?.startsWith(
                            "/docs/components/",
                          ) &&
                            link.name === "Components")
                            ? "bg-accent font-medium"
                            : "font-normal",
                        ]}
                      >
                        <div class="flex w-full items-center justify-between">
                          <span>{link.name}</span>
                          {link.new && (
                            <Badge variant="primary" class="ml-2">
                              New
                            </Badge>
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
