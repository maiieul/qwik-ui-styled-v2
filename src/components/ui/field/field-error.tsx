import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { Field as HeadlessField } from "@qds.dev/ui";
import errorStyles from "./field-error.css?inline";

export const Error = component$(({ ...props }: PropsOf<"div">) => {
  useStyles$(errorStyles);
  return (
    <HeadlessField.Error
      data-slot="field-error"
      class={[
        "field-error",
        "text-sm font-normal text-alert-foreground",
        props.class,
      ]}
      {...props}
    >
      <Slot />
    </HeadlessField.Error>
  );
});
