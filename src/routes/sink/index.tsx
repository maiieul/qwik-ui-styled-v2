import { component$, PropsOf, Slot } from "@qwik.dev/core";
import { Button, Card } from "~/components/ui";

export default component$(() => {
  return (
    <>
      <h2 class="text-2xl font-bold">Buttons</h2>
      <div class="m-10 grid grid-cols-6 justify-center gap-6">
        <Button variant="danger">Label</Button>
        <Button variant="outline">Label</Button>
        <Button variant="primary">Label</Button>
        <Button variant="secondary">Label</Button>
        <Button variant="altPrimary">Label</Button>
        <Button variant="altSecondary">Label</Button>
        <Button variant="ghost">Label</Button>
        <Button variant="link">Label</Button>
        <Button variant="altLink">Label</Button>
      </div>
      <h2 class="text-2xl font-bold">Cards</h2>
      <div class="m-10 grid grid-cols-2 justify-center gap-6">
        <SimpleCard variant="altPrimary"></SimpleCard>
        <SimpleCard variant="altSecondary"></SimpleCard>
        <SimpleCard variant="primary"></SimpleCard>
        <SimpleCard variant="secondary"></SimpleCard>
        <SimpleCard variant="outline"></SimpleCard>
      </div>
    </>
  );
});

const SimpleCard = component$<PropsOf<typeof Card.Root>>(({ ...props }) => {
  return (
    <Card.Root {...props} class="flex items-center justify-center gap-2 p-8">
      <Slot />
    </Card.Root>
  );
});
