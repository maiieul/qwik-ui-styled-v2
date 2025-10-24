import { component$, PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { AsChildTypes } from "@qds.dev/tools/vite";
import { Render } from "@qds.dev/ui";

import sharedButtonStyles from "./shared.css?inline";
import buttonStyles from "./button.css?inline";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "altPrimary"
  | "altSecondary"
  | "danger"
  | "outline"
  | "ghost"
  | "link"
  | "altLink";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = PropsOf<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
} & AsChildTypes;

export const Button = component$(
  ({ variant = "primary", size = "md", ...props }: ButtonProps) => {
    useStyles$(sharedButtonStyles);
    useStyles$(buttonStyles);
    return (
      <Render
        {...props}
        fallback="button"
        class={["btn", variant, `btn-${size}`, props.class]}
      >
        <Slot />
      </Render>
    );
  },
);
