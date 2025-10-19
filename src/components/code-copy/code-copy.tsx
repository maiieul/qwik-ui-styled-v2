import { PropsOf, component$, useSignal } from "@qwik.dev/core";
import { Button } from "~/components/ui";
import { cn } from "@qwik-ui/utils";
import copy from "clipboard-copy";
import { Lucide } from "@qds.dev/ui";

export type CodeCopyProps = PropsOf<typeof Button> & {
  code?: string;
};

export const CodeCopy = component$<CodeCopyProps>(({ code = "", ...props }) => {
  const copied = useSignal(false);

  return (
    <Button
      {...props}
      look="ghost"
      title={copied.value ? "Copied to Clipboard" : "Copy to Clipboard"}
      class={cn("hover:bg-slate-700 hover:text-slate-50", props.class)}
      onClick$={async () => {
        await copy(code);
        copied.value = true;

        setTimeout(() => {
          copied.value = false;
        }, 4000);
      }}
    >
      {copied.value ? (
        <Lucide.Check class="text-white" />
      ) : (
        <Lucide.Copy class="text-white" />
      )}
    </Button>
  );
});
