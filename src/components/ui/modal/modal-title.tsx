import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { modal } from "@qds.dev/ui";
import titleStyles from "./modal-title.css?inline";

export const Title = component$<PropsOf<"h2">>((props) => {
  useStyles$(titleStyles);
  return (
    <modal.title {...props} class={["modal-title", props.class]}>
      <Slot />
    </modal.title>
  );
});
