import { type Component, type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { CodeCopy } from "../code-copy/code-copy";
import { Note } from "../note/note";
import { DocsCallout } from "../docs-callout";
import { CodeSnippet } from "./code-snippet";
import { CodeSnippets } from "./code-snippets";

export const components: Record<string, Component> = {
  a: component$<PropsOf<"a">>(({ ...props }) => {
    return (
      <a
        {...props}
        class={["mdx-a", props.class]}
        target="_blank"
        rel="noreferrer"
      >
        <Slot />
      </a>
    );
  }),
  blockquote: component$(() => {
    return (
      <Note>
        <Slot />
      </Note>
    );
  }),
  ul: component$<PropsOf<"ul">>(({ ...props }) => {
    return (
      <ul {...props} class={["mdx-ul", props.class]}>
        <Slot />
      </ul>
    );
  }),
  li: component$<PropsOf<"li">>(({ ...props }) => {
    return (
      <li {...props} class={["mdx-li", props.class]}>
        <Slot />
      </li>
    );
  }),
  pre: component$<
    PropsOf<"pre"> & {
      rawCodeString?: string;
    }
  >(({ rawCodeString, ...props }) => {
    return (
      <div
        class="code-example data-pagefind-ignore relative mb-6"
        data-pagefind-ignore="all"
      >
        <CodeCopy class="absolute top-3 right-3 z-10" code={rawCodeString} />
        <div class="max-h-125 max-w-full overflow-auto rounded-md border text-sm shadow-md">
          <pre {...props} class={["py-4 pr-12 pl-4", props.class]}>
            <Slot />
          </pre>
        </div>
      </div>
    );
  }),
  CodeSnippet,
  CodeSnippets,
  DocsCallout,
};
