import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import titleStyles from "./card-title.css?inline";

export const Title = component$<PropsOf<"h3">>((props) => {
  useStyles$(titleStyles);
  return (
    <h3 {...props} class={["card-title", props.class]}>
      <Slot />
    </h3>
  );
});
