import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
import pageStyles from "./breadcrumb-page.css?inline";

export const Page = component$<PropsOf<"span">>((props) => {
  useStyles$(pageStyles);
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      {...props}
      class={["breadcrumb-page", props.class]}
    >
      <Slot />
    </span>
  );
});
