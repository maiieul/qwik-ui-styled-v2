import { component$, useSignal } from "@qwik.dev/core";
import { Lucide } from "@qds.dev/ui";
import { Button, IconButton, Modal } from "~/components/ui";

export default component$(() => {
  const show = useSignal(false);
  return (
    <Modal.Root bind:show={show}>
      <Modal.Trigger asChild>
        <Button>Open modal</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Title>Edit Profile</Modal.Title>
        <Modal.Description>
          Make changes to your profile here. Click save when you're done.
        </Modal.Description>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            {/* <Label for="name" class="text-right">
              Name
            </Label> */}
            {/* <Input name="name" id="name" defaultValue="Pedro Duarte" class="col-span-3" /> */}
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            {/* <Label for="username" class="text-right">
              Username
            </Label>
            <Input
              name="username"
              id="username"
              defaultValue="@peduarte"
              class="col-span-3"
            /> */}
          </div>
        </div>
        <footer>
          <Button variant="primary" onClick$={() => (show.value = false)}>
            Save
          </Button>
        </footer>
        <Modal.Close asChild>
          <IconButton class="absolute top-2 right-3">
            <Lucide.X class="h-5 w-5" />
          </IconButton>
        </Modal.Close>
      </Modal.Content>
    </Modal.Root>
  );
});
