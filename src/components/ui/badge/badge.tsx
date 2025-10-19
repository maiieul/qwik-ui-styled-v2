import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import badgeStyles from "./badge.css?inline";
import { AsChildTypes } from "@qds.dev/tools/vite";

export type Variant = "primary" | "secondary" | "danger" | "outline";

type BadgeProps = PropsOf<"div"> & {
  variant?: Variant;
} & AsChildTypes;

export const Badge = component$<BadgeProps>(
  ({ variant = "primary", ...props }) => {
    useStyles$(badgeStyles);
    return (
      <div {...props} class={[`badge badge-${variant}`, props.class]}>
        <Slot />
      </div>
    );
  },
);
