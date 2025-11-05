import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import legendStyles from "./field-legend.css?inline";

export const Legend = component$<
  PropsOf<"legend"> & { variant?: "legend" | "label" }
>(({ variant = "legend", ...props }) => {
  useStyles$(legendStyles);
  return (
    <legend
      data-variant={variant}
      class={[
        "field-legend",
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        props.class,
      ]}
      {...props}
    >
      <Slot />
    </legend>
  );
});


