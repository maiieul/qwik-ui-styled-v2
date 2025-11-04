import { component$, PropsOf, Slot } from "@qwik.dev/core";
import { Chip, Button, Callout, Card, Modal, Separator } from "~/components/ui";
import { Lucide } from "@qds.dev/ui";
export default component$(() => {
  return (
    <>
      <h2 class="text-2xl font-bold">Chips</h2>
      <div class="m-10 flex justify-start gap-6">
        <Chip variant="primary">Primary</Chip>
        <Chip variant="secondary">Secondary</Chip>
        <Chip variant="outline">Outline</Chip>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Chip variant="alt-primary">Primary</Chip>
        <Chip variant="alt-secondary">Secondary</Chip>
        <Chip variant="alt-outline">Outline</Chip>
      </div>
      <div class="m-10 flex justify-start gap-6">
        <Chip variant="danger">Danger</Chip>
      </div>

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
        <Button variant="primary" disabled>
          <Lucide.Loader class="size-5 animate-spin" />
          Confirm
        </Button>
        <Button variant="secondary" disabled>
          <Lucide.Loader class="size-5 animate-spin" />
          Add to cart
        </Button>
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
      <div class="m-10 grid grid-cols-2 justify-center gap-6">
        <CardExample variant="outline"></CardExample>
        <CardExample variant="altOutline"></CardExample>
        <CardExample variant="secondary"></CardExample>
        <CardExample variant="altSecondary"></CardExample>
        <CardExample variant="primary"></CardExample>
        <CardExample variant="altPrimary"></CardExample>
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
      <h2 class="text-2xl font-bold">Modals</h2>
      <div class="m-10 grid grid-cols-2 justify-center gap-6">
        <ModalExample></ModalExample>
      </div>
    </>
  );
});

const CardExample = component$<PropsOf<typeof Card.Root>>(({ ...props }) => {
  return (
    <Card.Root {...props} class="flex items-center justify-center gap-2 py-32">
      <Slot />
    </Card.Root>
  );
});

const ModalExample = component$<PropsOf<typeof Modal.Root>>(({ ...props }) => {
  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <Button>Open modal</Button>
      </Modal.Trigger>
      <Modal.Content variant="primary">
        <Modal.Title>Qwik UI</Modal.Title>
        <Modal.Description>
          An open-source UI component library.
        </Modal.Description>
        <p class="mt-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
        <footer class="mt-6 flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </footer>
      </Modal.Content>
    </Modal.Root>
  );
});
