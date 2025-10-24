import { component$, PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { AsChildTypes } from "@qds.dev/tools/vite";
import { Render } from "@qds.dev/ui";

import iconButtonStyles from "./icon-button.css?inline";
import sharedButtonStyles from "./shared.css?inline";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "altPrimary"
  | "altSecondary"
  | "danger"
  | "outline"
  | "ghost";
type IconButtonSize = "sm" | "md" | "lg";

type IconButtonProps = PropsOf<"button"> & {
  variant?: ButtonVariant;
  size?: IconButtonSize;
} & AsChildTypes;

export const IconButton = component$(
  ({ variant = "ghost", size = "md", ...props }: IconButtonProps) => {
    useStyles$(sharedButtonStyles);
    useStyles$(iconButtonStyles);
    return (
      <Render
        {...props}
        fallback="button"
        class={["btn", variant, `icon-btn-${size}`, props.class]}
      >
        <Slot />
      </Render>
    );
  },
);
