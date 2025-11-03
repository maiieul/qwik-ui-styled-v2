import { type PropsOf, Slot, component$, useStyles$ } from "@qwik.dev/core";
import { Modal as HeadlessModal } from "@qds.dev/ui";
import contentStyles from "./modal-content.css?inline";

type ContentProps = PropsOf<typeof HeadlessModal.Content> & {
  position?: "center" | "top" | "bottom" | "left" | "right";
  variant?: "primary" | "secondary" | "altPrimary" | "altSecondary" | "outline";
};

export const Content = component$<ContentProps>(
  ({ position = "center", variant = "outline", ...props }) => {
    useStyles$(contentStyles);
    return (
      <HeadlessModal.Content
        {...props}
        class={[
          "modal-content",
          `position-${position}`,
          `variant-${variant}`,
          props.class,
        ]}
      >
        <Slot />
      </HeadlessModal.Content>
    );
  },
);
