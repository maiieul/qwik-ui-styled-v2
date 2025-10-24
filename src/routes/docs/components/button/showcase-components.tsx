import { component$ } from "@qwik.dev/core";
import { Showcase } from "~/components/mdx/showcase";

import Primary from "./examples/primary";
import PrimaryRawCode from "./examples/primary.tsx?raw";
export const ShowcasePrimary = component$(() => {
  return (
    <Showcase rawCode={PrimaryRawCode}>
      <Primary />
    </Showcase>
  );
});

import Secondary from "./examples/secondary";
import SecondaryRawCode from "./examples/secondary.tsx?raw";
export const ShowcaseSecondary = component$(() => {
  return (
    <Showcase rawCode={SecondaryRawCode}>
      <Secondary />
    </Showcase>
  );
});

import Danger from "./examples/danger";
import AlertRawCode from "./examples/danger.tsx?raw";
export const ShowcaseAlert = component$(() => {
  return (
    <Showcase rawCode={AlertRawCode}>
      <Danger />
    </Showcase>
  );
});

import Outline from "./examples/outline";
import OutlineRawCode from "./examples/outline.tsx?raw";
export const ShowcaseOutline = component$(() => {
  return (
    <Showcase rawCode={OutlineRawCode}>
      <Outline />
    </Showcase>
  );
});

import Ghost from "./examples/ghost";
import GhostRawCode from "./examples/ghost.tsx?raw";
export const ShowcaseGhost = component$(() => {
  return (
    <Showcase rawCode={GhostRawCode}>
      <Ghost />
    </Showcase>
  );
});

import Link from "./examples/link";
import LinkRawCode from "./examples/link.tsx?raw";
export const ShowcaseLink = component$(() => {
  return (
    <Showcase rawCode={LinkRawCode}>
      <Link />
    </Showcase>
  );
});

import Size from "./examples/size";
import SizeRawCode from "./examples/size.tsx?raw";
export const ShowcaseSize = component$(() => {
  return (
    <Showcase rawCode={SizeRawCode}>
      <Size />
    </Showcase>
  );
});

import Icon from "./examples/icon";
import IconRawCode from "./examples/icon.tsx?raw";
export const ShowcaseIcon = component$(() => {
  return (
    <Showcase rawCode={IconRawCode}>
      <Icon />
    </Showcase>
  );
});

import WithIcon from "./examples/with-icon";
import WithIconRawCode from "./examples/with-icon.tsx?raw";
export const ShowcaseWithIcon = component$(() => {
  return (
    <Showcase rawCode={WithIconRawCode}>
      <WithIcon />
    </Showcase>
  );
});

import Loading from "./examples/loading";
import LoadingRawCode from "./examples/loading.tsx?raw";
export const ShowcaseLoading = component$(() => {
  return (
    <Showcase rawCode={LoadingRawCode}>
      <Loading />
    </Showcase>
  );
});
