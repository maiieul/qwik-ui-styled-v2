import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { Modal as HeadlessModal } from "@qds.dev/ui";
import titleStyles from "./modal-title.css?inline";

export const Title = component$<PropsOf<"h2">>((props) => {
  useStyles$(titleStyles);
  return (
    <HeadlessModal.Title {...props} class={["modal-title", props.class]}>
      <Slot />
    </HeadlessModal.Title>
  );
});
