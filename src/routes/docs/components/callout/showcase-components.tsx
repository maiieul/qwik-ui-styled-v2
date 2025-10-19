import { component$ } from "@qwik.dev/core";
import { Showcase } from "~/components/mdx/showcase";

import Hero from "./examples/hero";
import HeroRawCode from "./examples/hero.tsx?raw";
export const ShowcaseHero = component$(() => {
  return (
    <Showcase rawCode={HeroRawCode}>
      <Hero />
    </Showcase>
  );
});

import Alert from "./examples/danger";
import DangerRawCode from "./examples/danger.tsx?raw";
export const ShowcaseDanger = component$(() => {
  return (
    <Showcase rawCode={DangerRawCode}>
      <Alert />
    </Showcase>
  );
});
