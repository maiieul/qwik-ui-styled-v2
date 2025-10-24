import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import footerStyles from "./card-footer.css?inline";

export const Footer = component$<PropsOf<"div">>(({ ...props }) => {
  useStyles$(footerStyles);
  return (
    <div {...props} class={["card-footer", props.class]}>
      <Slot />
    </div>
  );
});
