import { component$, PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { AsChildTypes } from "@qds.dev/tools/vite";

import iconButtonStyles from "./icon-button.css?inline";

import { SharedButtonSizes, SharedButtonVariants } from "./shared";
import { Render } from "../render";

type IconButtonProps = {
  variant?: SharedButtonVariants;
  size?: SharedButtonSizes;
};

export const IconButton = component$<
  AsChildTypes & PropsOf<"button"> & IconButtonProps
>(({ variant = "ghost", size = "md", ...props }) => {
  useStyles$(iconButtonStyles);
  return (
    <Render
      {...props}
      fallback="button"
      class={["btn icon-btn", props.class]}
      variant={variant}
      size={size}
    >
      <Slot />
    </Render>
  );
});
