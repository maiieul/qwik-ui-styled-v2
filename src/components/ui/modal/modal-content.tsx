import { type PropsOf, Slot, component$, useStyles$ } from "@qwik.dev/core";
import { modal } from "@qds.dev/ui";
import contentStyles from "./modal-content.css?inline";

type ContentProps = PropsOf<typeof modal.content> & {
  position?: "center" | "top" | "bottom" | "left" | "right";
  variant?: "primary" | "secondary" | "outline";
};

export const Content = component$<ContentProps>(
  ({ position = "center", variant = "outline", ...props }) => {
    useStyles$(contentStyles);
    return (
      <modal.content
        {...props}
        class={[
          "modal-content",
          `position-${position}`,
          `variant-${variant}`,
          props.class,
        ]}
      >
        <Slot />
      </modal.content>
    );
  },
);
