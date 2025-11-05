import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import fieldsetStyles from "./field-fieldset.css?inline";

export const FieldSet = component$(({ ...props }: PropsOf<"fieldset">) => {
  useStyles$(fieldsetStyles);
  return (
    <fieldset
      class={[
        "field-fieldset",
        "flex flex-col gap-6",
        "has-[>[.checkbox-group]]:gap-3 has-[>[.radio-group]]:gap-3",
        props.class,
      ]}
      {...props}
    >
      <Slot />
    </fieldset>
  );
});


