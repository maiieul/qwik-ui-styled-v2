import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import rootStyles from "./breadcrumb-root.css?inline";

export type BreadcrumbProps = PropsOf<"nav">;

export const Root = component$<BreadcrumbProps>((props) => {
  useStyles$(rootStyles);
  return (
    <nav aria-label="breadcrumb" {...props}>
      <Slot />
    </nav>
  );
});
