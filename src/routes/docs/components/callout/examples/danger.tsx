import { component$ } from "@qwik.dev/core";
import { Callout } from "~/components/ui";
import { Lucide } from "@qds.dev/ui";

export default component$(() => {
  return (
    <Callout.Root variant="danger">
      <Lucide.TriangleAlert class="h-4 w-4" />
      <Callout.Title>Error</Callout.Title>
      <Callout.Description>
        Your session has expired. Please log in again.
      </Callout.Description>
    </Callout.Root>
  );
});
