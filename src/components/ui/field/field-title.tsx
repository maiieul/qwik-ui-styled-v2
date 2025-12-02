import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import titleStyles from "./field-title.css?inline";

export const Title = component$(({ ...props }: PropsOf<"div">) => {
  useStyles$(titleStyles);
  return (
    <div
      data-slot="field-label"
      class={[
        "field-title",
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium text-foreground-accent group-data-[disabled=true]/field:opacity-50",
        props.class,
      ]}
      {...props}
    >
      <Slot />
    </div>
  );
});
