import { component$ } from "@qwik.dev/core";
import { Button } from "~/components/ui";
import { Lucide } from "@qds.dev/ui";

export default component$(() => {
  return (
    <Button size="icon">
      <Lucide.Github />
    </Button>
  );
});
