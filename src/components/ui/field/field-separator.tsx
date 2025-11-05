import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import { Separator as StyledSeparator } from "../separator/separator";
import separatorStyles from "./field-separator.css?inline";

export const Separator = component$(({ children, ...props }: PropsOf<"div">) => {
  useStyles$(separatorStyles);
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      class={[
        "field-separator",
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        props.class,
      ]}
      {...props}
    >
      <StyledSeparator class="absolute inset-0 top-1/2" />
      <span
        class={[
          "field-separator-content",
          "relative mx-auto block w-fit bg-background px-2 text-muted-foreground",
          props.class,
        ]}
        data-slot="field-separator-content"
      >
        <Slot />
      </span>
    </div>
  );
});


