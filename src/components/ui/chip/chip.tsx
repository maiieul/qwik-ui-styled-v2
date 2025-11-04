import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import chipStyles from "./chip.css?inline";
import { AsChildTypes } from "@qds.dev/tools/vite";

export type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "alt-primary"
  | "alt-secondary"
  | "alt-outline"
  | "danger";

type ChipProps = PropsOf<"div"> & {
  variant?: Variant;
} & AsChildTypes;

export const Chip = component$<ChipProps>(
  ({ variant = "primary", ...props }) => {
    useStyles$(chipStyles);
    return (
      <div {...props} class={[`chip chip-${variant}`, props.class]}>
        <Slot />
      </div>
    );
  },
);
