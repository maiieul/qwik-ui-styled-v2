// import { component$, type PropsOf, Slot, useStyles$ } from "@qwik.dev/core";
// import buttonStyles from "./button.css?inline";

// type ButtonLook =
//   | "primary"
//   | "secondary"
//   | "danger"
//   | "outline"
//   | "ghost"
//   | "link";
// type ButtonSize = "sm" | "md" | "lg" | "icon";

// type ButtonProps = PropsOf<"button"> & {
//   look?: ButtonLook;
//   size?: ButtonSize;
// };

// export const Button = component$<ButtonProps>(
//   ({ size = "md", look = "primary", ...props }) => {
//     useStyles$(buttonStyles);
//     return (
//     <Render
//       {...props}
//       fallback="button"
// class={[`btn btn-${look} btn-${size}`, props.class]}    ></Render>
//         <Slot />
//     </Render>
//     );
//   },
// );

import { AsChildTypes } from "@qds.dev/tools/vite";
import { Render } from "@qds.dev/ui";
import { cn } from "@qwik-ui/utils";
import { component$, type PropsOf, Slot } from "@qwik.dev/core";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-all duration-100 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      look: {
        primary:
          "border-base bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:shadow-base active:press",
        secondary:
          "border-base bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90 active:shadow-base active:press",
        danger:
          "border-base bg-danger text-danger-foreground shadow-sm hover:bg-danger/90 active:shadow-base active:press",
        outline:
          "border bg-background text-foreground shadow-sm hover:bg-accent active:shadow-base active:press",
        ghost: "text-accent-foreground hover:bg-accent",
        link: "text-foreground hover:bg-transparent hover:text-foreground/80 hover:underline hover:underline-offset-2",
      },
      size: {
        sm: "h-8 px-2 py-1.5 text-sm",
        md: "h-12 px-4 py-3 text-base",
        lg: " h-16 px-8 py-4 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      look: "primary",
      size: "md",
    },
  },
);

type ButtonProps = PropsOf<"button"> &
  VariantProps<typeof buttonVariants> &
  AsChildTypes;

export const Button = component$(({ size, look, ...props }: ButtonProps) => {
  return (
    <Render
      {...props}
      fallback="button"
      class={cn(buttonVariants({ size, look }), props.class)}
    >
      <Slot />
    </Render>
  );
});
