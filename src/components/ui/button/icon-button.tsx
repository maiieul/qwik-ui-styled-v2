import { component$, PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { AsChildTypes } from "@qds.dev/tools/vite";

import iconButtonStyles from "./icon-button.css?inline";

import { ButtonSizes } from "./shared";
import { Render } from "@qds.dev/ui";

type IconButtonProps = {
  variant?: "outline" | "ghost" | "vanilla";
  size?: ButtonSizes;
};

export const IconButton = component$<
  AsChildTypes & PropsOf<"button"> & IconButtonProps
>(({ variant = "vanilla", size = "md", ...props }) => {
  useStyles$(iconButtonStyles);
  return (
    <Render
      {...props}
      fallback="button"
      class={[
        "btn-base icon-btn",
        `variant-${variant}`,
        `size-${size}`,
        props.class,
      ]}
    >
      <Slot />
    </Render>
  );
});
