import { component$, PropsOf, Slot } from "@qwik.dev/core";
import { Button, Callout, Card, Select, Separator } from "~/components/ui";
import { Lucide } from "@qds.dev/ui";
export default component$(() => {
  return (
    <>
      <h2 class="text-2xl font-bold">Buttons</h2>

      <div class="m-10 grid grid-cols-6 justify-center gap-6">
        <Button variant="link">Label</Button>
        <Button variant="ghost">Label</Button>
        <Button variant="outline">Label</Button>
        <Button variant="secondary">Label</Button>
        <Button variant="primary">Label</Button>
      </div>
      <div class="m-10 grid grid-cols-6 justify-center gap-6">
        <Button variant="altLink">Label</Button>
        <Button variant="altGhost">Label</Button>
        <Button variant="altOutline">Label</Button>
        <Button variant="altSecondary">Label</Button>
        <Button variant="altPrimary">Label</Button>
      </div>
      <div class="m-10 grid grid-cols-6 justify-center gap-6"></div>
      <div class="m-10 grid grid-cols-6 justify-center gap-6">
        <Button variant="dangerGhost">Label</Button>
        <Button variant="dangerOutline">Label</Button>
        <Button variant="dangerPrimary">Label</Button>
      </div>
      <h2 class="text-2xl font-bold">Select</h2>
      <div class="m-10 grid grid-cols-6 justify-center gap-6">
        <Select.Root>
          <Select.Label>Logged in users</Select.Label>
          <Select.Trigger onClick$={() => console.log("clicked")}>
            <Select.DisplayValue placeholder="Select an option" />
          </Select.Trigger>
          <Select.Popover gutter={8}>
            {["Tim", "Ryan", "Jim", "Jessie", "Abby"].map((user) => (
              <Select.Item key={user}>
                <Select.ItemLabel>{user}</Select.ItemLabel>
                <Select.ItemIndicator>
                  <Lucide.Check class="h-4 w-4" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Popover>
        </Select.Root>
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
            <h4 class="text-sm font-medium leading-none">Qwik UI</h4>
            <p class="text-muted-foreground text-sm">
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
