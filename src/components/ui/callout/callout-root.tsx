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
  variant?: "outline" | "danger";
};

export const CalloutContextId = createContextId<"outline" | "danger">(
  "callout",
);

export const Root = component$<RootProps>(
  ({ variant = "outline", ...props }) => {
    useStyles$(rootStyles);
    useContextProvider(CalloutContextId, variant);
    return (
      <div {...props} class={[`callout-root variant-${variant}`, props.class]}>
        <Slot />
      </div>
    );
  },
);
