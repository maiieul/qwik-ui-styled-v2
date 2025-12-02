import { component$ } from "@qwik.dev/core";
import { Callout } from "~/components/ui";
import { Lucide } from "@qds.dev/ui";

export default component$(() => {
  return (
    <Callout.Root variant="alert">
      <Lucide.TriangleAlert class="size-5" />
      <Callout.Title>Error</Callout.Title>
      <Callout.Description>
        Your session has expired. Please log in again.
      </Callout.Description>
    </Callout.Root>
  );
});
