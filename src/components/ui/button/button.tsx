import { component$, PropsOf, Slot, useStyles$ } from "@qwik.dev/core";

import buttonStyles from "./button.css?inline";
import { ButtonSizes } from "./shared";
import { Render } from "../render";

export type ButtonVariants =
  | "primary"
  | "secondary"
  | "outline"
  | "link"
  | "ghost"
  | "vanilla"
  | "alert";

export type ButtonProps = {
  variant?: ButtonVariants;
  size?: ButtonSizes;
};

export const Button = component$<
  PropsOf<"button"> & ButtonProps & { asChild?: true }
>(({ variant = "main", size = "md", ...props }) => {
  useStyles$(buttonStyles);
  return (
    <Render
      {...props}
      fallback="button"
      class={[
        "btn-base btn",
        `variant-${variant}`,
        `size-${size}`,
        props.class,
      ]}
    >
      <Slot />
    </Render>
  );
});
