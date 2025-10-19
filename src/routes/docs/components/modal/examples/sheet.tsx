import { PropsOf, Slot, component$, useSignal } from "@qwik.dev/core";
import { cn } from "@qwik-ui/utils";
import { Lucide } from "@qds.dev/ui";
import { Button, Modal } from "~/components/ui";

export default component$(() => {
  return (
    <>
      <Sheet position="top">Top</Sheet>
      <div class="my-4 flex space-x-24">
        <Sheet position="left">Left</Sheet>
        <Sheet position="right">Right</Sheet>
      </div>

      <Sheet position="bottom">Bottom</Sheet>
    </>
  );
});

export const Sheet = component$<PropsOf<typeof Modal.Content>>(
  ({ ...props }) => {
    const show = useSignal(false);
    return (
      <Modal.Root bind:show={show}>
        <Modal.Trigger
        // class={[buttonVariants({ look: "ghost" }), "w-20"]}
        >
          <Slot />
        </Modal.Trigger>
        <Modal.Content {...props}>
          <Modal.Title>Edit Profile</Modal.Title>
          <Modal.Description>
            Make changes to your profile here. Click save when you're done.
          </Modal.Description>
          <div class="mt-6">
            {/* <Label for="name" class="text-right">
            Name
          </Label>
          <Input
            name="name"
            id="name"
            defaultValue="Pedro Duarte"
            class="col-span-3 w-[300px]"
          /> */}
          </div>
          <footer class="mt-6">
            <Button look="primary" onClick$={() => (show.value = false)}>
              Save
            </Button>
          </footer>
          <Modal.Close
            class={cn(
              // buttonVariants({ size: "icon", look: "link" }),
              "absolute top-2 right-3",
            )}
            type="submit"
          >
            <Lucide.X class="h-5 w-5" />
          </Modal.Close>
        </Modal.Content>
      </Modal.Root>
    );
  },
);
