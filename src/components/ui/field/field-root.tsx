"use client";

import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { Field as HeadlessField } from "@qds.dev/ui";
import { cva, type VariantProps } from "class-variance-authority";
import rootStyles from "./field-root.css?inline";

const fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-danger-foreground",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
        responsive: [
          "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

export const Root = component$<
  PropsOf<typeof HeadlessField.Root> & VariantProps<typeof fieldVariants>
>(({ orientation = "vertical", ...props }) => {
  useStyles$(rootStyles);
  return (
    <HeadlessField.Root
      data-slot="field"
      data-orientation={orientation}
      class={["field-root", fieldVariants({ orientation }), props.class]}
      {...props}
    >
      <Slot />
    </HeadlessField.Root>
  );
});
