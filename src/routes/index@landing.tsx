import { component$ } from "@qwik.dev/core";
import { DocumentHead } from "@qwik.dev/router";
import { Card } from "~/components/ui";

// Keeping these so that we can integrate them later when refactoring the landing page to be more professional
// const whyHeadless = [
//   {
//     emoji: '🧑‍🎨',
//     description: 'Create your own components from scratch',
//   },
//   {
//     emoji: '⛓️‍💥',
//     description:
//       'Use with vanilla CSS, SASS, TailwindCSS, UnoCSS, PandaCSS, or whateverCSS',
//   },
//   {
//     emoji: '🧑‍🎓',
//     description:
//       'Learn about the headless APIs, accessibility, and the html/css features to come',
//   },
// ];

// const whyStyled = [
//   {
//     emoji: '😌',
//     description: 'Start with good defaults',
//   },
//   {
//     emoji: '💫',
//     description: "Change your entire app's style & theme at the click of a button",
//   },
//   {
//     emoji: '👏',
//     description: 'Avoid code duplication thanks to cva variants',
//   },
// ];

export default component$(() => {
  return (
    <div class="flex flex-col items-center gap-8 py-24">
      <h1 class="text-center text-4xl leading-normal lg:text-5xl">
        <span class="font-extrabold tracking-wide text-standalone">Qwik</span>{" "}
        <span class="text-secondary font-extrabold tracking-wide">UI</span>
      </h1>
      <h2 class="text-center text-xl leading-normal font-bold lg:text-3xl">
        Headless & styled copy-paste components
        <br />
        <span class="leading-normal text-standalone">
          automatically optimized for you
        </span>
      </h2>
      <p class="text-center text-lg lg:text-xl">
        Choose a kit and start building the future{" "}
        <span class="hue-rotate-150">⚡</span>
      </p>
      <div class="mt-4 flex flex-wrap justify-center justify-items-center gap-14">
        <a href={`/docs/styled/introduction`}>
          <Card.Root class="ease-step relative block h-full max-w-md rounded-lg shadow-lg outline-1 duration-150 hover:scale-[1.025] focus:scale-[1.025]">
            <img
              src={`/images/qwik-ui-fluffy-creature-screen.webp`}
              width="300"
              height="300"
              alt={`styled kit`}
              class="w-full rounded-t-sm object-cover"
            />
            <Card.Header>
              <Card.Title class="text-xl">Styled</Card.Title>
              <Card.Description class="text-lg">
                A design system of copy-paste, reusable, styled components built
                on top of headless. Easy to use, easy to customize.
              </Card.Description>
            </Card.Header>
          </Card.Root>
        </a>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik UI - The world's fastest loading UI components library",
};
