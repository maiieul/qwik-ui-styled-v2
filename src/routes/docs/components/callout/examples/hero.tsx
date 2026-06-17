import { component$ } from "@qwik.dev/core";
import { lucide } from "@qds.dev/ui";
import { Callout } from "~/components/ui";

export default component$(() => {
  return (
    <Callout.Root>
      <lucide.trianglealert class="h-4 w-4" />
      <Callout.Title>Heads up!</Callout.Title>
      <Callout.Description>
        You can add components to your app using the cli.
      </Callout.Description>
    </Callout.Root>
  );
});
