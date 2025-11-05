import { component$, type PropsOf, Slot } from "@qwik.dev/core";

export type BreadcrumbProps = PropsOf<"nav">;

export const Root = component$<BreadcrumbProps>((props) => {
  return (
    <nav aria-label="breadcrumb" {...props}>
      <Slot />
    </nav>
  );
});
