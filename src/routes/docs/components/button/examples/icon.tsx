import { component$ } from "@qwik.dev/core";
import { lucide } from "@qds.dev/ui";
import { IconButton } from "~/components/ui";

export default component$(() => {
  return (
    <IconButton>
      <lucide.github />
    </IconButton>
  );
});
