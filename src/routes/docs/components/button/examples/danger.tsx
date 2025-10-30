import { component$ } from "@qwik.dev/core";
import { Button } from "~/components/ui";

export default component$(() => {
  return (
    <>
      <Button variant="danger-outline">Danger</Button>
    </>
  );
});
