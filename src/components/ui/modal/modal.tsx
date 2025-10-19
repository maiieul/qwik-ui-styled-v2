import { type PropsOf, Slot, component$, useStyles$ } from "@qwik.dev/core";
import { Modal as HeadlessModal } from "@qds.dev/ui";
import mcStyles from "./modal.css?inline";
const Root = HeadlessModal.Root;

const Trigger = HeadlessModal.Trigger;

const Close = HeadlessModal.Close;

type ContentProps = PropsOf<typeof HeadlessModal.Content> & {
  position?: "center" | "top" | "bottom" | "left" | "right";
};

const Content = component$<ContentProps>(
  ({ position = "center", ...props }) => {
    useStyles$(mcStyles);
    return (
      <HeadlessModal.Content
        {...props}
        class={["ui-mc", `ui-mc-${position}`, props.class]}
      >
        <Slot />
      </HeadlessModal.Content>
    );
  },
);

const Title = component$<PropsOf<"h2">>(({ ...props }) => {
  return (
    <HeadlessModal.Title
      {...props}
      class={["text-lg font-semibold tracking-tight", props.class]}
    >
      <Slot />
    </HeadlessModal.Title>
  );
});

const Description = component$<PropsOf<"p">>(({ ...props }) => {
  return (
    <HeadlessModal.Description
      {...props}
      class={["text-muted-foreground text-sm", props.class]}
    >
      <Slot />
    </HeadlessModal.Description>
  );
});

export const Modal = {
  Root,
  Trigger,
  Close,
  Content,
  Title,
  Description,
};
