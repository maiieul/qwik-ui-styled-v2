import { component$, Slot } from "@qwik.dev/core";
import Header from "~/components/header/header";
import { horizontalLayout } from "./horizontal-layout.constant";

export default component$(() => {
  return (
    <>
      <div class={[horizontalLayout, "fixed z-10"]}>
        <div />
        <div class="flex w-full items-center justify-center px-12 lg:px-16">
          <Header />
        </div>
        <div />
      </div>
      <main>
        <Slot />
      </main>
      {/* <Footer /> */}
    </>
  );
});
