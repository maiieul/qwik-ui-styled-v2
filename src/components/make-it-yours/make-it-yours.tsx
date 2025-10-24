import {
  $,
  PropsOf,
  component$,
  useComputed$,
  useVisibleTask$,
} from "@qwik.dev/core";
import { Lucide } from "@qds.dev/ui";

import { Button, IconButton, Modal } from "~/components/ui";
import CopyCssConfig from "~/components/copy-css-config/copy-css-config";

import { useTheme } from "~/hooks/use-theme/provider";
import { ThemeConfig } from "~/utils/theme/types";
import { cn } from "@qwik-ui/utils";

export default component$<PropsOf<typeof Button>>(() => {
  const { themeSig } = useTheme();

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
  return (
    <Modal.Root>
      <Modal.Trigger class="flex sm:mr-2 sm:h-10" asChild>
        <Button variant="ghost">
          <Lucide.SlidersHorizontal class={cn("h-4 w-4 sm:mr-2")} />
          <span class={cn("hidden", "sm:block")}>Make it yours</span>
        </Button>
      </Modal.Trigger>
      <Modal.Content position="right">
        <header class="flex w-full">
          <h2 class="justify-self-start text-lg font-bold">Edit Profile</h2>
        </header>
        <div class="mb-2 mt-8 py-4">
          <label class="mb-1 block font-medium">Preset</label>
          <select
            class="rounded-base bg-background h-12 w-full border p-2"
            value={themeObjectComputed.value.style}
            onChange$={async (e, el) => {
              themeObjectComputed.value.style = el.value;
              themeSig.value = await computedThemeObjectToThemeArray();
            }}
          >
            <option value={"modern"}>Modern</option>
            <option value={"qwik"}>Qwik</option>
          </select>
        </div>

        <footer class="flex w-full justify-between gap-4">
          <Button
            variant="ghost"
            onClick$={() => {
              themeSig.value = themeSig.value?.includes("dark")
                ? "dark"
                : "light";
            }}
          >
            Reset
          </Button>
          <CopyCssConfig />
        </footer>
        <Modal.Close class="fixed right-4 top-5" asChild>
          <IconButton>
            <Lucide.X />
          </IconButton>
        </Modal.Close>
      </Modal.Content>
    </Modal.Root>
  );
});
