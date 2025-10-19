import { component$, Slot } from "@qwik.dev/core";
import Header from "~/components/header/header";

export default component$(() => {
  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
      {/* <Footer /> */}
    </>
  );
});
