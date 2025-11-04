import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import itemStyles from "./breadcrumb-item.css?inline";

export const Item = component$<PropsOf<"li">>((props) => {
  useStyles$(itemStyles);
  return (
    <li {...props} class={["breadcrumb-item", props.class]}>
      <Slot />
    </li>
  );
});
