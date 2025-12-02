import { component$, Slot, useStyles$, type PropsOf } from "@qwik.dev/core";

import rootStyles from "./callout-root.css?inline";

type RootProps = PropsOf<"div"> & {
  variant?: "outline" | "alt-outline" | "alert";
};

export const Root = component$<RootProps>(
  ({ variant = "outline", role, ...props }) => {
    useStyles$(rootStyles);
    return (
      <div
        {...props}
        class={[`callout-root variant-${variant}`, props.class]}
        role={variant === "alert" ? "alert" : role}
      >
        <Slot />
      </div>
    );
  },
);
