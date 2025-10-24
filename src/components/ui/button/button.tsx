import { component$, PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { AsChildTypes } from "@qds.dev/tools/vite";
import { Render } from "@qds.dev/ui";

import buttonStyles from "./button.css?inline";
import { SharedButtonSizes, SharedButtonVariants } from "./shared";

export type ButtonVariant =
  | SharedButtonVariants
  | "link"
  | "altLink"
  | "dangerPrimary"
  | "dangerOutline"
  | "dangerGhost";

export type ButtonProps = PropsOf<"button"> & {
  variant?: ButtonVariant;
  size?: SharedButtonSizes;
} & AsChildTypes;

export const defaultProps: Record<"button", ButtonProps> = {
  button: {
    variant: "primary",
    size: "md",
  },
};

export const Button = component$(
  ({
    variant = defaultProps.button.variant,
    size = defaultProps.button.size,
    ...props
  }: ButtonProps) => {
    useStyles$(buttonStyles);
    return (
      <Render
        {...props}
        fallback="button"
        class={["btn", `btn-${variant}`, `btn-${size}`, props.class]}
      >
        <Slot />
      </Render>
    );
  },
);
