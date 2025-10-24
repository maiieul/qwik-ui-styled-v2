import { Lucide } from "@qds.dev/ui";
import { component$ } from "@qwik.dev/core";
import { Button } from "~/components/ui";

export default component$(() => {
  return (
    <Button disabled>
      <Lucide.Loader class="mr-2 size-4 animate-spin" /> Login with Email
    </Button>
  );
});
