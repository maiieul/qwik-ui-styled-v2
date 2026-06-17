import { component$ } from "@qwik.dev/core";
import { Callout } from "~/components/ui";
import { lucide } from "@qds.dev/ui";

export default component$(() => {
  return (
    <Callout.Root variant="alert">
      <lucide.trianglealert class="size-5" />
      <Callout.Title>Error</Callout.Title>
      <Callout.Description>
        Your session has expired. Please log in again.
      </Callout.Description>
    </Callout.Root>
  );
});
