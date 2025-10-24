import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import cardStyles from "./card-root.css?inline";

export type CardVariant = PropsOf<"div"> & {
  variant?:
    | "primary"
    | "secondary"
    | "altPrimary"
    | "altSecondary"
    | "outline"
    | "altOutline";
};

export const Root = component$<CardVariant>(
  ({ variant = "outline", ...props }) => {
    useStyles$(cardStyles);
    return (
      <div {...props} class={[`card card-${variant}`, props.class]}>
        <Slot />
      </div>
    );
  },
);
