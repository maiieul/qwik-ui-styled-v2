import { PropsOf, component$ } from "@qwik.dev/core";
import { Highlight } from "../highlight/highlight";

type CodeSnippetProps = PropsOf<"div"> & {
  code: string;
};

export const CodeSnippet = component$<CodeSnippetProps>(({ code }) => {
  return (
    <div class="mb-6 rounded-md border shadow-lg">
      <Highlight code={code} />
    </div>
  );
});
