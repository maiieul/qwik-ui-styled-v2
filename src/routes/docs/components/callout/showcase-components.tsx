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

import Alert from "./examples/alert";
import AlertRawCode from "./examples/alert.tsx?raw";
export const ShowcaseAlert = component$(() => {
  return (
    <Showcase rawCode={AlertRawCode}>
      <Alert />
    </Showcase>
  );
});
