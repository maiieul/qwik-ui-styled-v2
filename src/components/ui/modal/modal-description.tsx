import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { Modal as HeadlessModal } from "@qds.dev/ui";
import descriptionStyles from "./modal-description.css?inline";

export const Description = component$<PropsOf<"p">>((props) => {
  useStyles$(descriptionStyles);
  return (
    <HeadlessModal.Description
      {...props}
      class={["modal-description", props.class]}
    >
      <Slot />
    </HeadlessModal.Description>
  );
});
