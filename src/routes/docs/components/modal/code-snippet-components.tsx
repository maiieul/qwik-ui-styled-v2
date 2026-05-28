import { component$ } from "@qwik.dev/core";
import { CodeSnippet } from "~/components/mdx/code-snippet";

import ModalRawCode from "~/components/ui/modal/index.tsx?raw";

export const ModalCodeSnippet = component$(() => {
  return <CodeSnippet code={ModalRawCode} />;
});
