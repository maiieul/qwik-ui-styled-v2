import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import descriptionStyles from "./field-description.css?inline";
import { Field } from "@qds.dev/ui";

export const Description = component$(({ ...props }: PropsOf<"p">) => {
  useStyles$(descriptionStyles);
  return (
    <Field.Description
      data-slot="field-description"
      class={["field-description", props.class]}
      {...props}
    >
      <Slot />
    </Field.Description>
  );
});
