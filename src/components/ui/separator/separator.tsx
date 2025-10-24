import { type PropsOf, component$, useStyles$ } from "@qwik.dev/core";
import { Separator as HeadlessSeparator } from "../../headless/separator";
import separatorStyles from "./separator.css?inline";
export const Separator = component$<PropsOf<typeof HeadlessSeparator>>(
  ({ orientation = "horizontal", decorative = true, ...props }) => {
    useStyles$(separatorStyles);
    return (
      <>
        <HeadlessSeparator
          {...props}
          decorative={decorative}
          orientation={orientation}
          class={[
            orientation === "horizontal"
              ? "separator-horizontal"
              : "separator-vertical",
            props.class,
          ]}
        />
      </>
    );
  },
);
