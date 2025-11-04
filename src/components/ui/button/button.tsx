import { component$, PropsOf, Slot, useStyles$ } from "@qwik.dev/core";

import buttonStyles from "./button.css?inline";
import { SharedButtonSizes, SharedButtonVariants } from "./shared";
import { Render } from "../render";

export type ButtonVariants =
  | SharedButtonVariants
  | "link"
  | "alt-link"
  | "danger-outline"
  | "danger-ghost";

export type ButtonProps = {
  variant?: ButtonVariants;
  size?: SharedButtonSizes;
};

export const Button = component$<
  PropsOf<"button"> & ButtonProps & { asChild?: true }
>(({ variant = "primary", size = "md", ...props }) => {
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
