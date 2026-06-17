import { lucide } from "@qds.dev/ui";
import { $, component$, JSXOutput, PropsOf, Slot } from "@qwik.dev/core";
import { Callout } from "~/components/ui";

// TODO: potentially remove since Callout could be used as is, passing an icon prop for base use cases, and a component + Title + Description components if necessary.

export const DocsCallout = component$<
  PropsOf<typeof Callout.Root> & {
    title?: string;
    icon?: "info" | "alert" | JSXOutput;
  }
>(({ title, variant = "alert", icon, ...props }) => {
  const renderIcon = $(() => {
    if (!icon) return null;

    switch (icon) {
      case "info":
        return <lucide.info name="icon" class="h-5 w-5" />;
      case "warning":
        return <lucide.trianglealert name="icon" class="h-5 w-5" />;
      case "alert":
        return <lucide.octagonalert name="icon" class="h-5 w-5" />;
      default:
        return icon;
    }
  });

  return (
    <Callout.Root variant={variant} data-variant={variant} {...props}>
      {renderIcon()}
      {title && <Callout.Title>{title}</Callout.Title>}
      <Callout.Description>
        <Slot />
      </Callout.Description>
    </Callout.Root>
  );
});
