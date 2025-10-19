import { component$, Slot, useStyles$, type PropsOf } from "@qwik.dev/core";

import titleStyles from "./callout-title.css?inline";

export const Title = component$<PropsOf<"h5">>(({ ...props }) => {
  useStyles$(titleStyles);
  return (
    <h5 {...props} class={["callout-title", props.class]}>
      <Slot />
    </h5>
  );
});
