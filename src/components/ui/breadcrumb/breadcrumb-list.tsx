import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import listStyles from "./breadcrumb-list.css?inline";

export const List = component$<PropsOf<"ol">>((props) => {
  useStyles$(listStyles);
  return (
    <ol {...props} class={["breadcrumb-list", props.class]}>
      <Slot />
    </ol>
  );
});
