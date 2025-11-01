import { component$, PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { AsChildTypes } from "@qds.dev/tools/vite";
import { Render } from "@qds.dev/ui";

import buttonStyles from "./button.css?inline";
import { SharedButtonSizes, SharedButtonVariants } from "./shared";

export type ButtonVariant =
  | SharedButtonVariants
  | "link"
  | "alt-link"
  | "danger-outline"
  | "danger-ghost";

export type ButtonProps = PropsOf<"button"> &
  AsChildTypes & {
    variant?: ButtonVariant;
    size?: SharedButtonSizes;
    unstyled?: boolean;
  };

export const Button = component$<ButtonProps>(
  ({ variant = "primary", size = "md", unstyled = false, ...props }) => {
    useStyles$(buttonStyles);
    return (
      <Render
        {...props}
        fallback="button"
        class={[!unstyled && "btn", props.class]}
        unstyled={unstyled}
        variant={variant}
        size={size}
      >
        <Slot />
      </Render>
    );
  },
);
