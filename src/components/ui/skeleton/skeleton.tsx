import { type PropsOf, component$ } from "@qwik.dev/core";

export const Skeleton = component$<PropsOf<"div">>(({ ...props }) => {
  return <div {...props} class={["skeleton", props.class]} />;
});
