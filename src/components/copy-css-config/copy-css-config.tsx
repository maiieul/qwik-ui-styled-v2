import { component$ } from "@qwik.dev/core";
import { IconButton, Modal } from "~/components/ui";
import { Button } from "~/components/ui";
import { Lucide } from "@qds.dev/ui";
import { Highlight } from "../highlight/highlight";

export default component$<{ cssThemeOutput: string }>(({ cssThemeOutput }) => {
  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <Button variant="primary">Get config</Button>
      </Modal.Trigger>
      <Modal.Content class="max-w-2xl">
        <header>
          <h2 class="mb-2 text-lg font-bold">Copy config</h2>
          <p class="mb-6">
            Copy and paste the following code into your global.css file to apply
            the styles.
          </p>
        </header>
        <div>
          <Highlight code={cssThemeOutput} language="css" class="border" />
        </div>
      </Modal.Content>
      <Modal.Close class="absolute top-7 right-6" asChild>
        <IconButton>
          <Lucide.X />
        </IconButton>
      </Modal.Close>
    </Modal.Root>
  );
});
