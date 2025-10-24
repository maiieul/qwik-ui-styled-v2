import { component$, PropsOf, Slot } from "@qwik.dev/core";

type SelectListboxProps = PropsOf<"ul">;

/**
 * @deprecated This component is deprecated. It will be removed in a future release.
 */
export const HSelectListbox = component$<SelectListboxProps>(() => {
  return (
    <>
      <Slot />
    </>
  );
});
