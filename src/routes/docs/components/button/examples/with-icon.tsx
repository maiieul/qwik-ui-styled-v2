import { component$ } from "@qwik.dev/core";
import { lucide } from "@qds.dev/ui";
import { Button } from "~/components/ui";

export default component$(() => {
  return (
    <Button>
      <lucide.mail class="mr-2" /> Login with Email
    </Button>
  );
});
