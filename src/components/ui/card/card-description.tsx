import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import descriptionStyles from "./card-description.css?inline";

export const Description = component$<PropsOf<"p">>((props) => {
  useStyles$(descriptionStyles);
  return (
    <p {...props} class={["card-description", props.class]}>
      <Slot />
    </p>
  );
});
