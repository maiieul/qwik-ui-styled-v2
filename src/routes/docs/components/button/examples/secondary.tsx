import { component$ } from "@qwik.dev/core";
import { Button } from "~/components/ui";

export default component$(() => {
  return (
    <>
      <Button variant="auxiliary">Secondary</Button>
    </>
  );
});
