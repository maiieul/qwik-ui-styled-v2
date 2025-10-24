import { component$ } from "@qwik.dev/core";
import { Lucide } from "@qds.dev/ui";
import { Button } from "~/components/ui";

export default component$(() => {
  return (
    <Button>
      <Lucide.Mail class="mr-2" /> Login with Email
    </Button>
  );
});
