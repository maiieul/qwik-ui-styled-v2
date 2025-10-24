import { component$, PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { AsChildTypes } from "@qds.dev/tools/vite";
import { Render } from "@qds.dev/ui";

import iconButtonStyles from "./icon-button.css?inline";

import { SharedButtonSizes, SharedButtonVariants } from "./shared";

type IconButtonProps = PropsOf<"button"> & {
  variant?: SharedButtonVariants;
  size?: SharedButtonSizes;
} & AsChildTypes;

export const IconButton = component$(
  ({ variant = "ghost", size = "md", ...props }: IconButtonProps) => {
    useStyles$(iconButtonStyles);
    return (
      <Render
        {...props}
        fallback="button"
        class={["btn", `btn-${variant}`, `icon-btn-${size}`, props.class]}
      >
        <Slot />
      </Render>
    );
  },
);
