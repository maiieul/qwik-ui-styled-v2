import { $, component$, useSignal } from "@qwik.dev/core";
import { IconButton, Modal } from "~/components/ui";
import { Button } from "~/components/ui";
import { outputAppliedThemedCSS } from "~/utils/theme/extract-theme";
import { Lucide } from "@qds.dev/ui";
import { useTheme } from "~/hooks/use-theme/provider";
import globalCSS from "~/global.css?raw";
import { Highlight } from "../highlight/highlight";

export default component$(() => {
  const cssThemeOutput = useSignal<string>("");

  const { themeSig, defaultTheme, storageKey } = useTheme();

  return (
    <Modal.Root>
      <Modal.Trigger
        asChild
        onClick$={$(async () => {
          themeSig.value = localStorage.getItem(storageKey) ?? defaultTheme;
          cssThemeOutput.value = await outputAppliedThemedCSS(
            themeSig.value === "dark" || themeSig.value === "light"
              ? "border-radius-0 simple primary-cyan-600 light base-slate"
              : themeSig.value,
            globalCSS,
          );
        })}
      >
        <Button variant="main">Get config</Button>
      </Modal.Trigger>
      <Modal.Content>
        <header>
          <h2 class="mb-2 text-lg font-bold">Copy config</h2>
          <p class="mb-6">
            Copy and paste the following code into your global.css file to apply
            the styles.
          </p>
        </header>
        <div>
          <Highlight
            code={cssThemeOutput.value}
            language="css"
            class="border"
          />
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
