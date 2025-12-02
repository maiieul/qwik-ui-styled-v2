import { type Component, type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { cn } from "@qwik-ui/utils";
import { CodeCopy } from "../code-copy/code-copy";
import { Note } from "../note/note";
import { DocsCallout } from "../docs-callout";
import { CodeSnippet } from "./code-snippet";
import { CodeSnippets } from "./code-snippets";

export const components: Record<string, Component> = {
  p: component$<PropsOf<"p">>(({ ...props }) => {
    return (
      <p {...props} class={[cn("mb-6 last:mb-0", props.class)]}>
        <Slot />
      </p>
    );
  }),
  h1: component$<PropsOf<"h1">>(({ ...props }) => {
    return (
      <h1
        {...props}
        class={[
          cn(
            "mb-6 scroll-mt-24 pt-6 text-3xl font-bold text-foreground md:text-5xl",
            props.class,
          ),
        ]}
      >
        <Slot />
      </h1>
    );
  }),
  h2: component$<PropsOf<"h2">>(({ ...props }) => {
    return (
      <h2
        {...props}
        class={[
          cn(
            "mt-12 mb-4 scroll-mt-24 text-3xl font-bold text-foreground",
            props.class,
          ),
        ]}
      >
        <Slot />
      </h2>
    );
  }),
  h3: component$<PropsOf<"h3">>(({ ...props }) => {
    return (
      <h3
        {...props}
        class={[
          cn(
            "mt-8 mb-2 scroll-mt-20 text-xl font-semibold text-foreground",
            props.class,
          ),
        ]}
      >
        <Slot />
      </h3>
    );
  }),
  h4: component$<PropsOf<"h4">>(({ ...props }) => {
    return (
      <h4
        {...props}
        class={[
          cn("mt-6 mb-4 text-lg font-medium text-foreground", props.class),
        ]}
      >
        <Slot />
      </h4>
    );
  }),
  h5: component$<PropsOf<"h5">>(({ ...props }) => {
    return (
      <h5
        {...props}
        class={[cn("text-base font-medium text-foreground", props.class)]}
      >
        <Slot />
      </h5>
    );
  }),
  a: component$<PropsOf<"a">>(({ ...props }) => {
    return (
      <a
        {...props}
        class={[
          cn(
            "font-semibold underline underline-offset-4 hover:opacity-90",
            props.class,
          ),
        ]}
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
      <ul
        {...props}
        class={[cn("mb-4 list-disc px-6 font-medium", props.class)]}
      >
        <Slot />
      </ul>
    );
  }),
  li: component$<PropsOf<"li">>(({ ...props }) => {
    return (
      <li {...props} class={[cn("py-2", props.class)]}>
        <Slot />
      </li>
    );
  }),
  pre: component$<{
    rawCodeString?: string;
  }>(({ rawCodeString }) => {
    return (
      <div
        class="code-example data-pagefind-ignore relative mb-6 max-h-125"
        data-pagefind-ignore="all"
      >
        <CodeCopy class="absolute top-3 right-3" code={rawCodeString} />
        <div
          class="max-h-125 max-w-full overflow-y-auto rounded-md border p-6 text-sm shadow-md"
          style={{ backgroundColor: "#1b1e28", color: "#a6accd" }}
        >
          <pre>
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
