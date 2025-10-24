import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import headerStyles from "./card-header.css?inline";

export const Header = component$<PropsOf<"div">>((props) => {
  useStyles$(headerStyles);
  return (
    <div {...props} class={["card-header", props.class]}>
      <Slot />
    </div>
  );
});
