import { component$, type PropsOf, useStyles$ } from "@qwik.dev/core";
import { lucide } from "@qds.dev/ui";
import separatorStyles from "./breadcrumb-separator.css?inline";

export const Separator = component$<PropsOf<"li">>((props) => {
  useStyles$(separatorStyles);
  return (
    <li role="presentation" aria-hidden="true" {...props} class={[props.class]}>
      <lucide.chevronright class="breadcrumb-separator" />
    </li>
  );
});
