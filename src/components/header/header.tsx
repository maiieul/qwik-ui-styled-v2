import { $, PropsOf, component$, useSignal } from "@qwik.dev/core";

import { Lucide } from "@qds.dev/ui";
import { IconButton, Modal } from "~/components/ui";

import { DocsNavigation } from "../navigation-docs/navigation-docs";
import { DiscordIcon } from "../icons/discord";
import { LogoIcon } from "../icons/logo";
import { useTheme } from "~/hooks/use-theme/provider";
import MakeItYours from "../make-it-yours/make-it-yours";
import { Theme } from "~/hooks/use-theme/types";
export interface HeaderProps {
  showVersion?: boolean;
  showBottomBorder?: boolean;
}

export default component$(() => {
  const isSidebarOpenedSig = useSignal(false);

  return (
    <header class="z-10 mt-4 flex h-14 w-full items-center justify-between border bg-background shadow-xs">
      <section class="flex items-center justify-start">
        <a href="/" aria-label="Qwik UI Logo" class="ml-4">
          <LogoIcon class="block h-8 w-8 hover:drop-shadow-xs hover:drop-shadow-white" />
        </a>
        <a href="/docs/getting-started/" class="ml-4">
          Docs
        </a>
      </section>

      <div class="mr-4 flex items-center">
        <div class="xs:space-x-4 flex items-center space-x-1">
          <MakeItYours />
          <IconButton asChild>
            <a href="https://discord.gg/PVWUUejrez" target="_blank">
              <DiscordIcon />
            </a>
          </IconButton>
          <IconButton asChild>
            <a href="https://github.com/qwikifiers/qwik-ui" target="_blank">
              <Lucide.Github />
            </a>
          </IconButton>
          <DarkModeToggle />
          <Modal.Root>
            <Modal.Trigger
              asChild
              aria-label="Toggle navigation"
              class={["flex lg:hidden"]}
            >
              <IconButton>
                <Lucide.Menu />
              </IconButton>
            </Modal.Trigger>
            <Modal.Content position="right">
              <div class="mb-2 pt-2 pb-4">
                <DocsNavigation class="max-w-80 overflow-auto bg-background" />
              </div>
              <Modal.Close
                autoFocus
                onClick$={() => (isSidebarOpenedSig.value = false)}
                class="absolute top-6 right-6"
              >
                <Lucide.X />
              </Modal.Close>
            </Modal.Content>
          </Modal.Root>
        </div>
      </div>
    </header>
  );
});

const DarkModeToggle = component$<PropsOf<typeof IconButton>>(
  ({ ...props }) => {
    const { themeSig } = useTheme();

    const switchMode = $((theme: Theme): Theme => {
      if (!theme) return "light";
      if (theme.includes("light")) {
        return theme.replace("light", "dark");
      } else if (theme.includes("dark")) {
        return theme.replace("dark", "light");
      }
    });

    return (
      <IconButton
        {...props}
        aria-label="Toggle dark mode"
        onClick$={async () => {
          themeSig.value = await switchMode(
            themeSig.value || localStorage.getItem("theme") || "light",
          );
        }}
      >
        <span class="hidden dark:block">
          <Lucide.Moon class="size-5" />
        </span>
        <span class="block dark:hidden">
          <Lucide.Sun class="size-5" />
        </span>
      </IconButton>
    );
  },
);
