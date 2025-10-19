import {
  component$,
  Slot,
  useContext,
  useStyles$,
  type PropsOf,
} from "@qwik.dev/core";

import descriptionStyles from "./callout-description.css?inline";
import { CalloutContextId } from "./callout-root";

export const Description = component$<PropsOf<"div">>(({ ...props }) => {
  useStyles$(descriptionStyles);
  const variant = useContext(CalloutContextId);
  return (
    <div
      {...props}
      class={[`callout-description variant-${variant}`, props.class]}
    >
      <Slot />
    </div>
  );
});
