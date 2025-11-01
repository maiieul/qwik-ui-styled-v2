import { component$, PropsOf, Slot } from "@qwik.dev/core";
import { Button, Callout, Card, Separator } from "~/components/ui";
import { Lucide } from "@qds.dev/ui";
export default component$(() => {
  return (
    <>
      <h2 class="text-2xl font-bold">Buttons</h2>

      <div class="m-10 flex justify-start gap-6">
        <Button variant="link">home</Button>
        <Button variant="ghost">Discard</Button>
        <Button variant="outline">Turn off</Button>
        <Button variant="secondary">Learn more</Button>
        <Button variant="primary">Confirm</Button>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Button variant="alt-link">home</Button>
        <Button variant="alt-ghost">Discard</Button>
        <Button variant="alt-outline">Turn off</Button>
        <Button variant="alt-secondary">Learn more</Button>
        <Button variant="alt-primary">Confirm</Button>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Button variant="danger-ghost">Cancel</Button>
        <Button variant="danger-outline">Delete</Button>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Button variant="outline" size="sm">
          Confirm
          <Lucide.Check name="icon" />
        </Button>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Button variant="outline" size="md">
          Confirm
          <Lucide.Check name="icon" />
        </Button>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Button variant="outline" size="lg">
          Confirm
          <Lucide.Check name="icon" />
        </Button>
      </div>
      <h2 class="text-2xl font-bold">Cards</h2>
      <div class="m-10 grid grid-cols-3 justify-center gap-6">
        <SimpleCard variant="altOutline"></SimpleCard>
        <SimpleCard variant="altSecondary"></SimpleCard>
        <SimpleCard variant="altPrimary"></SimpleCard>
        <SimpleCard variant="outline"></SimpleCard>
        <SimpleCard variant="secondary"></SimpleCard>
        <SimpleCard variant="primary"></SimpleCard>
      </div>
      <h2 class="text-2xl font-bold">Separator</h2>
      <div class="m-10 grid grid-cols-2 justify-center gap-6">
        <div>
          <div class="space-y-1">
            <h4 class="text-sm leading-none font-medium">Qwik UI</h4>
            <p class="text-sm text-muted-foreground">
              An open-source UI component library.
            </p>
          </div>
          <Separator class="my-4" />
          <div class="flex h-5 items-center space-x-4 text-sm">
            <div>Customizable</div>
            <Separator orientation="vertical" />
            <div>Accessible</div>
            <Separator orientation="vertical" />
            <div>Optimized for you</div>
          </div>
        </div>
      </div>
      <h2 class="text-2xl font-bold">Callout</h2>
      <div class="m-10 grid grid-cols-2 justify-center gap-6">
        <Callout.Root variant="outline">
          <Lucide.Info name="icon" class="h-5 w-5" />
          <Callout.Title>Qwik UI</Callout.Title>
          <Callout.Description>
            An open-source UI component library.
          </Callout.Description>
        </Callout.Root>
        <Callout.Root variant="danger">
          <Lucide.OctagonAlert name="icon" class="h-5 w-5" />
          <Callout.Title>Qwik UI</Callout.Title>
          <Callout.Description>
            An open-source UI component library.
          </Callout.Description>
        </Callout.Root>
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
