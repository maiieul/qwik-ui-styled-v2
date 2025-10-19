import { $, PropsOf, component$, useSignal, useStyles$ } from "@qwik.dev/core";

import { DocsNavigation } from "../navigation-docs/navigation-docs";
import { useTheme } from "../use-theme/provider";
import { Button } from "../ui";
import { DiscordIcon } from "../icons/discord";
import { GitHubIcon } from "../icons/gitHub";
import { Modal } from "@qds.dev/ui";
import { Lucide } from "@qds.dev/ui";
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
        "bg-background sticky top-0 z-10 flex h-16 justify-center border-b",
        themeSig.value?.includes("brutalist") && "border-b-2",
      ]}
      bind:show={isSidebarOpenedSig}
    >
      <header class="flex w-full items-center justify-between">
        <section class="flex items-center justify-start">
          <a href="/" aria-label="Qwik UI Logo" class="ml-4">
            <LogoIcon class="hover:drop-shadow-accent block h-8 w-8 hover:drop-shadow-sm" />
          </a>
          <a href="/docs/getting-started/" class="ml-4">
            Docs
          </a>
        </section>

        <div class="mr-4 flex items-center">
          <div class="xs:space-x-4 flex items-center space-x-1">
            <a
              href="https://discord.gg/PVWUUejrez"
              target="_blank"
              // class={[buttonVariants({ size: "icon", look: "ghost" })]}
            >
              <DiscordIcon />
            </a>
            <a
              target="_blank"
              href="https://github.com/qwikifiers/qwik-ui"
              aria-label="Qwik-UI GitHub repository"
              // class={[buttonVariants({ size: "icon", look: "ghost" })]}
            >
              <GitHubIcon />
            </a>
            <DarkModeToggle />
            <Modal.Trigger
              aria-label="Toggle navigation"
              class={[
                // buttonVariants({ size: "icon", look: "ghost" }),
                "flex lg:hidden",
              ]}
            >
              <Lucide.Menu class="h-6 w-6" />
            </Modal.Trigger>
          </div>
        </div>
      </header>
      <Modal.Content class="sidebar-mobile rounded-base bg-background text-foreground mr-0 ml-auto h-screen w-sm border-0 shadow-md">
        <div class="mb-2 pt-2 pb-4">
          <DocsNavigation class="bg-background max-w-80 overflow-auto" />
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

const DarkModeToggle = component$<PropsOf<typeof Button>>(({ ...props }) => {
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
    <Button
      {...props}
      aria-label="Toggle dark mode"
      size="icon"
      look="ghost"
      onClick$={async () =>
        (themeSig.value = await switchLightDark(themeSig.value || "light"))
      }
    >
      <span class="hidden dark:block">
        <Lucide.Moon class="h-6 w-6" />
      </span>
      <span class="block dark:hidden">
        <Lucide.Sun class="h-6 w-6" />
      </span>
    </Button>
  );
});
