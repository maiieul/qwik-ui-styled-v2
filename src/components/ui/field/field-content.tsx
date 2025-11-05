import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import contentStyles from "./field-content.css?inline";

export const Content = component$(({ ...props }: PropsOf<"div">) => {
  useStyles$(contentStyles);
  return (
    <div
      data-slot="field-content"
      class={["field-content", "group/field-content", props.class]}
      {...props}
    >
      <Slot />
    </div>
  );
});
