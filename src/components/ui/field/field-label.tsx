import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import labelStyles from "./field-label.css?inline";

export const Label = component$(({ ...props }: PropsOf<"label">) => {
  useStyles$(labelStyles);
  return (
    <label
      data-slot="field-label"
      class={[
        "field-label",
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10 has-data-[state=checked]:border-primary-background",
        props.class,
      ]}
      {...props}
    >
      <Slot />
    </label>
  );
});
