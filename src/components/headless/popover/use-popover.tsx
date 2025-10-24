import {
  $,
  useOnDocument,
  useSignal,
  useTask$,
  isBrowser,
} from "@qwik.dev/core";

export function usePopover(customId?: string) {
  const hasPolyfillLoadedSig = useSignal<boolean>(false);
  const isSupportedSig = useSignal<boolean>(false);

  const didInteractSig = useSignal<boolean>(false);
  const programmaticRef = useSignal<HTMLElement | null>(null);
  const isCSRSig = useSignal<boolean>(false);

  const loadPolyfill$ = $(async () => {
    document.dispatchEvent(new CustomEvent("poppolyload"));
  });

  useTask$(() => {
    if (isBrowser) {
      isCSRSig.value = true;
    }
  });

  const initPopover$ = $(async () => {
    /* needs to run before poly load */
    const isSupported =
      typeof HTMLElement !== "undefined" &&
      typeof HTMLElement.prototype === "object" &&
      "popover" in HTMLElement.prototype;

    isSupportedSig.value = isSupported;

    if (!hasPolyfillLoadedSig.value && !isSupported) {
      console.log("loading polyfill");
      await loadPolyfill$();
    }

    console.log("didInteractSig", didInteractSig.value);
    if (!didInteractSig.value) {
      if (programmaticRef.value === null) {
        programmaticRef.value = document.getElementById(`${customId}-panel`);
      }

      // only opens the popover that is interacted with
      didInteractSig.value = true;
      console.log("didInteractSig", didInteractSig.value);
    }

    console.log("programmaticRef", programmaticRef.value);
    return programmaticRef.value;
  });

  // event is created after teleported properly
  useOnDocument(
    "showpopoverpoly",
    $(async () => {
      if (!didInteractSig.value) return;

      // make sure to load the polyfill after the client re-render
      await import("@oddbird/popover-polyfill");

      console.log("hasPolyfillLoadedSig", hasPolyfillLoadedSig.value);
      hasPolyfillLoadedSig.value = true;
    }),
  );

  const showPopover = $(async () => {
    console.log("showPopover");
    await initPopover$();

    if (!isSupportedSig.value) {
      // Wait until the polyfill has been loaded if necessary
      while (!hasPolyfillLoadedSig.value) {
        await new Promise((resolve) => setTimeout(resolve, 10)); // Poll every 10ms
      }
    }

    programmaticRef.value?.showPopover();
  });

  const togglePopover = $(async () => {
    await initPopover$();

    if (!isSupportedSig.value) {
      // Wait until the polyfill has been loaded if necessary
      while (!hasPolyfillLoadedSig.value) {
        await new Promise((resolve) => setTimeout(resolve, 10)); // Poll every 10ms
      }
    }

    console.log("togglePopover", programmaticRef.value);
    programmaticRef.value?.togglePopover();
  });

  const hidePopover = $(async () => {
    await initPopover$();

    if (!isSupportedSig.value) {
      // Wait until the polyfill has been loaded if necessary
      while (!hasPolyfillLoadedSig.value) {
        await new Promise((resolve) => setTimeout(resolve, 10)); // Poll every 10ms
      }
    }

    programmaticRef.value?.hidePopover();
  });

  return {
    showPopover,
    togglePopover,
    hidePopover,
    initPopover$,
    hasPolyfillLoadedSig,
    isSupportedSig,
  };
}
