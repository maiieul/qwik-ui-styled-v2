import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import groupStyles from "./field-group.css?inline";

export const Group = component$(({ ...props }: PropsOf<"div">) => {
  useStyles$(groupStyles);
  return (
    <div
      data-slot="field-group"
      class={[
        "field-group",
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        props.class,
      ]}
      {...props}
    >
      <Slot />
    </div>
  );
});


