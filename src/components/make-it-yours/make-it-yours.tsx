import {
  $,
  PropsOf,
  component$,
  useComputed$,
  useSignal,
} from "@qwik.dev/core";
import { Lucide } from "@qds.dev/ui";

import { Button, IconButton, Modal } from "~/components/ui";
import CopyCssConfig from "~/components/copy-css-config/copy-css-config";

import { useTheme } from "~/hooks/use-theme/provider";
import { ThemeConfig } from "~/utils/extract-themed-css/types";
import { extractThemedCSS } from "~/utils/extract-themed-css/extract-themed-css";
import globalCSS from "~/global.css?raw";

export default component$<PropsOf<typeof Button>>(() => {
  const { themeSig, defaultTheme } = useTheme();

  const extractGlobalCSS = $(async () => {
    return await extractThemedCSS(globalCSS, themeSig.value ?? defaultTheme);
  });

  const themeObjectComputed = useComputed$((): ThemeConfig => {
    if (!themeSig.value) {
      return {
        mode: "light",
        style: "qwik",
      };
    }

    const themeArray = Array.isArray(themeSig.value)
      ? themeSig.value
      : themeSig.value.split(" ");
    return {
      mode: themeArray[0],
      style: themeArray[1],
    };
  });

  const computedThemeObjectToThemeArray = $((): string => {
    const { mode, style } = themeObjectComputed.value;
    return [mode, style].filter(Boolean).join(" ");
  });

  const cssThemeOutput = useSignal<string>("");

  return (
    <Modal.Root>
      <Modal.Trigger
        asChild
        onClick$={async () => {
          cssThemeOutput.value = await extractGlobalCSS();
        }}
      >
        <IconButton>
          <Lucide.WandSparkles class="size-5" />
        </IconButton>
      </Modal.Trigger>
      <Modal.Content position="right">
        <header class="flex w-full">
          <h2 class="justify-self-start text-lg font-bold">Edit Profile</h2>
        </header>
        <div class="mt-8 mb-2 py-4">
          <label class="mb-1 block font-medium">Preset</label>
          <select
            class="rounded-base h-12 w-full border bg-background p-2"
            value={themeObjectComputed.value.style}
            onChange$={async (e, el) => {
              themeObjectComputed.value.style = el.value;
              themeSig.value = await computedThemeObjectToThemeArray();
              cssThemeOutput.value = await extractGlobalCSS();
            }}
          >
            <option value={"modern"}>Modern</option>
            <option value={"qwik"}>Qwik</option>
          </select>
        </div>

        <footer class="flex w-full justify-between gap-4">
          <Button
            variant="vanilla"
            onClick$={() => {
              themeSig.value = themeSig.value?.includes("dark")
                ? "dark"
                : "light";
            }}
          >
            Reset
          </Button>
          <CopyCssConfig cssThemeOutput={cssThemeOutput} />
        </footer>
        <Modal.Close class="fixed top-5 right-4" asChild>
          <IconButton>
            <Lucide.X />
          </IconButton>
        </Modal.Close>
      </Modal.Content>
    </Modal.Root>
  );
});
