import { PropsOf, component$, useSignal } from "@qwik.dev/core";
import { Button, IconButton } from "~/components/ui";
import { cn } from "@qwik-ui/utils";
import copy from "clipboard-copy";
import { Lucide } from "@qds.dev/ui";

export type CodeCopyProps = PropsOf<typeof Button> & {
  code?: string;
};

export const CodeCopy = component$<CodeCopyProps>(({ code = "", ...props }) => {
  const copied = useSignal(false);

  return (
    <IconButton
      {...props}
      variant="ghost"
      title={copied.value ? "Copied to Clipboard" : "Copy to Clipboard"}
      class={cn("hover:bg-gray-800", props.class)}
      onClick$={async () => {
        await copy(code);
        copied.value = true;

        setTimeout(() => {
          copied.value = false;
        }, 4000);
      }}
    >
      {copied.value ? (
        <Lucide.Check class="size-4 fill-black text-white" />
      ) : (
        <Lucide.Copy class="size-4 fill-black text-white" />
      )}
    </IconButton>
  );
});
