import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStyles$,
  type PropsOf,
} from "@qwik.dev/core";

import rootStyles from "./callout-root.css?inline";

type RootProps = PropsOf<"div"> & {
  variant?: "outline" | "alt-outline" | "danger";
};

export const CalloutContextId = createContextId<
  "outline" | "alt-outline" | "danger"
>("callout");

export const Root = component$<RootProps>(
  ({ variant = "outline", role, ...props }) => {
    useStyles$(rootStyles);
    useContextProvider(CalloutContextId, variant);
    return (
      <div
        {...props}
        class={[`callout-root variant-${variant}`, props.class]}
        role={variant === "danger" ? "alert" : role}
      >
        <Slot />
      </div>
    );
  },
);
