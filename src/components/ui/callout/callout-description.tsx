import { component$, Slot, useStyles$, type PropsOf } from "@qwik.dev/core";

import descriptionStyles from "./callout-description.css?inline";

export const Description = component$<PropsOf<"div">>(({ ...props }) => {
  useStyles$(descriptionStyles);
  return (
    <div {...props} class={[`callout-description`, props.class]}>
      <Slot />
    </div>
  );
});
