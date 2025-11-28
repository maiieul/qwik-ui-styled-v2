import { component$, PropsOf, Slot, useStyles$ } from "@qwik.dev/core";

import buttonStyles from "./button.css?inline";
import { SharedButtonSizes } from "./shared";
import { Render } from "../render";

export type ButtonVariants =
  | "alt-link"
  | "alt-ghost"
  | "alt-outline"
  | "alt-secondary"
  | "alt-primary"
  | "danger"
  | "danger-ghost"
  | "danger-outline"
  | "danger-secondary"
  | "danger-primary";

export type ButtonProps = {
  variant?: ButtonVariants;
  size?: SharedButtonSizes;
};

export const Button = component$<
  PropsOf<"button"> & ButtonProps & { asChild?: true }
>(({ variant = "alt-primary", size = "md", ...props }) => {
  useStyles$(buttonStyles);
  return (
    <Render
      {...props}
      fallback="button"
      class={["btn", `variant-${variant}`, `size-${size}`, props.class]}
    >
      <Slot />
    </Render>
  );
});
