import { $, PropsOf, component$, useSignal, useStyles$ } from "@qwik.dev/core";

import { Modal, Lucide } from "@qds.dev/ui";
import { Button, IconButton } from "~/components/ui";

import { DocsNavigation } from "../navigation-docs/navigation-docs";
import { useTheme } from "../use-theme/provider";
import { DiscordIcon } from "../icons/discord";
import { LogoIcon } from "../icons/logo";
export interface HeaderProps {
  showVersion?: boolean;
  showBottomBorder?: boolean;
}

export default component$(() => {
  useStyles$(`
    .sidebar-mobile::backdrop {
      background: rgba(0,0,0,0.5);
    }
  
    .sidebar-mobile {
      animation: sidebarOpen 0.75s forwards cubic-bezier(0.6, 0.6, 0, 1);
    }
  
    .sidebar-mobile::backdrop {
      animation: sidebarFadeIn 0.75s forwards cubic-bezier(0.6, 0.6, 0, 1);
    }
  
    .sidebar-mobile.modal-closing {
      animation: sidebarClose 0.35s forwards cubic-bezier(0.6, 0.6, 0, 1);
    }
  
    .sidebar-mobile.modal-closing::backdrop {
      animation: sidebarFadeOut 0.35s forwards cubic-bezier(0.6, 0.6, 0, 1);
    }

    @keyframes sidebarOpen {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0%);
      }
    }
  
    @keyframes sidebarClose {
      from {
        opacity: 1;
        transform: translateX(0%);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
  
    @keyframes sidebarFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  
    @keyframes sidebarFadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
    `);

  const isSidebarOpenedSig = useSignal(false);

  const { themeSig } = useTheme();

  return (
    <Modal.Root
      class={[
        "sticky top-0 z-10 flex h-16 justify-center border-b border-alt-secondary-border bg-background shadow-xs shadow-alt-secondary-shadow",
        themeSig.value?.includes("brutalist") && "border-b-2",
      ]}
      bind:show={isSidebarOpenedSig}
    >
      <header class="flex w-full items-center justify-between">
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
            <Button asChild>
              <Modal.Trigger
                aria-label="Toggle navigation"
                class={["flex lg:hidden"]}
              >
                <Lucide.Menu />
              </Modal.Trigger>
            </Button>
          </div>
        </div>
      </header>
      <Modal.Content class="sidebar-mobile mr-0 ml-auto h-screen w-sm border-0 bg-background text-foreground shadow-md">
        <div class="mb-2 pt-2 pb-4">
          <DocsNavigation class="max-w-80 overflow-auto bg-background" />
        </div>
        <button
          autoFocus
          onClick$={() => (isSidebarOpenedSig.value = false)}
          class="absolute top-[26px] right-6"
        >
          <Lucide.X class="h-8 w-8" />
        </button>
      </Modal.Content>
    </Modal.Root>
  );
});

const DarkModeToggle = component$<PropsOf<typeof IconButton>>(
  ({ ...props }) => {
    const { themeSig } = useTheme();
    const switchLightDark = $(
      (input: string | string[]): string | string[] | undefined => {
        const switchWord = (word: string): string =>
          word.includes("light")
            ? word.replace("light", "dark")
            : word.replace("dark", "light");
        if (typeof input === "string") {
          return switchWord(input);
        } else if (Array.isArray(input)) {
          return input.map((item) => switchWord(item));
        }
      },
    );
    return (
      <IconButton
        {...props}
        aria-label="Toggle dark mode"
        onClick$={async () =>
          (themeSig.value = await switchLightDark(themeSig.value || "light"))
        }
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
