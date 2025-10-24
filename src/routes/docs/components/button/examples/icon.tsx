import { component$ } from "@qwik.dev/core";
import { Lucide } from "@qds.dev/ui";
import { IconButton } from "~/components/ui";

export default component$(() => {
  return (
    <IconButton>
      <Lucide.Github />
    </IconButton>
  );
});
