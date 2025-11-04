import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import linkStyles from "./breadcrumb-link.css?inline";

export const Link = component$<PropsOf<"a"> & { asChild?: boolean }>(
  (props) => {
    useStyles$(linkStyles);
    const Comp = props.asChild ? Slot : "a";
    return (
      <Comp {...props} class={["breadcrumb-link", props.class]}>
        {!props.asChild && <Slot />}
      </Comp>
    );
  },
);
