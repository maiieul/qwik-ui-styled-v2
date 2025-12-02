import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import chipStyles from "./chip.css?inline";
import { AsChildTypes } from "@qds.dev/tools/vite";

export type Variant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "alt-primary"
  | "alt-secondary"
  | "alt-tertiary"
  | "outline"
  | "alert";

type ChipProps = PropsOf<"div"> & {
  variant?: Variant;
  filled?: boolean;
} & AsChildTypes;

export const Chip = component$<ChipProps>(
  ({ variant = "outline", filled = false, ...props }) => {
    useStyles$(chipStyles);
    return (
      <div
        {...props}
        class={[`chip variant-${variant}`, filled && "filled", props.class]}
      >
        <Slot />
      </div>
    );
  },
);
