import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { modal } from "@qds.dev/ui";
import descriptionStyles from "./modal-description.css?inline";

export const Description = component$<PropsOf<"p">>((props) => {
  useStyles$(descriptionStyles);
  return (
    <modal.description {...props} class={["modal-description", props.class]}>
      <Slot />
    </modal.description>
  );
});
