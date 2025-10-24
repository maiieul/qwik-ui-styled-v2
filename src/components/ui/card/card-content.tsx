import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import contentStyles from "./card-content.css?inline";

export const Content = component$<PropsOf<"div">>((props) => {
  useStyles$(contentStyles);
  return (
    <div {...props} class={["card-content", props.class]}>
      <Slot />
    </div>
  );
});
