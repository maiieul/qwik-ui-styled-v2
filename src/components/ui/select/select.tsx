import { type PropsOf, Slot, component$, useStyles$ } from "@qwik.dev/core";
import { Select as HeadlessSelect } from "~/components/headless";
import { Lucide } from "@qds.dev/ui";
import styles from "./select.css?inline";

const Root = (props: PropsOf<typeof HeadlessSelect.Root>) => (
  <HeadlessSelect.Root
    {...props}
    selectItemComponent={Item}
    selectItemLabelComponent={ItemLabel}
    selectErrorMessageComponent={ErrorMessage}
  />
);

const Label = component$<PropsOf<typeof HeadlessSelect.Label>>(
  ({ ...props }) => {
    useStyles$(styles);
    return (
      <>
        <HeadlessSelect.Label {...props} class={["select-label", props.class]}>
          <Slot />
        </HeadlessSelect.Label>
      </>
    );
  },
);

const Trigger = component$<PropsOf<typeof HeadlessSelect.Trigger>>(
  ({ ...props }) => {
    useStyles$(styles);
    return (
      <>
        <HeadlessSelect.Trigger
          {...props}
          class={["select-trigger", props.class]}
        >
          <Slot />
          <Lucide.ChevronDown class="select-trigger-icon" />
        </HeadlessSelect.Trigger>
      </>
    );
  },
);

const DisplayValue = HeadlessSelect.DisplayValue;

const Popover = component$<PropsOf<typeof HeadlessSelect.Popover>>(
  ({ ...props }) => {
    useStyles$(styles);
    return (
      <>
        <HeadlessSelect.Popover
          {...props}
          class={["select-popover", props.class]}
        >
          <Slot />
        </HeadlessSelect.Popover>
      </>
    );
  },
);

const Group = HeadlessSelect.Group;

const GroupLabel = HeadlessSelect.GroupLabel;

const ErrorMessage = HeadlessSelect.ErrorMessage;

const Item = component$<PropsOf<typeof HeadlessSelect.Item>>(({ ...props }) => {
  useStyles$(styles);
  return (
    <HeadlessSelect.Item {...props} class={["select-item", props.class]}>
      <Slot />
    </HeadlessSelect.Item>
  );
});

const ItemIndicator = component$<PropsOf<typeof HeadlessSelect.ItemIndicator>>(
  ({ ...props }) => {
    useStyles$(styles);
    return (
      <span class="select-item-indicator-wrapper">
        <HeadlessSelect.ItemIndicator {...props}>
          <Lucide.Check class="select-item-indicator-icon" />
        </HeadlessSelect.ItemIndicator>
      </span>
    );
  },
);

const ItemLabel = component$<PropsOf<typeof HeadlessSelect.ItemLabel>>(
  ({ ...props }) => {
    return (
      <HeadlessSelect.ItemLabel {...props}>
        <Slot />
      </HeadlessSelect.ItemLabel>
    );
  },
);

export const Select = {
  Root,
  Label,
  Trigger,
  DisplayValue,
  Popover,
  Group,
  GroupLabel,
  Item,
  ItemIndicator,
  ItemLabel,
  ErrorMessage,
};
