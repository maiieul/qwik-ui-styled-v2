import { type ClassList, type PropsOf, component$ } from "@qwik.dev/core";
import { CodeCopy } from "../code-copy/code-copy";
import { cn } from "@qwik-ui/utils";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { createHighlighter } from "shiki/bundle/web";

const jsEngine = createJavaScriptRegexEngine();

const shiki = await createHighlighter({
  themes: ["poimandres"],
  langs: ["tsx", "html", "css"],
  engine: jsEngine,
});

export type HighlightProps = PropsOf<"div"> & {
  code: string;
  copyCodeClass?: ClassList;
  language?: "tsx" | "html" | "css";
};

export const Highlight = component$(
  ({ code, copyCodeClass, language = "tsx", ...props }: HighlightProps) => {
    return (
      <div class="relative">
        <CodeCopy
          class={["absolute right-3 top-3", copyCodeClass]}
          code={code}
        />
        <div
          {...props}
          class={cn(
            "tab-size max-h-118 max-w-full overflow-auto rounded-sm text-sm",
            props.class,
          )}
        >
          <div
            class="[&>pre]:py-4 [&>pre]:pl-4 [&>pre]:pr-12"
            dangerouslySetInnerHTML={shiki.codeToHtml(code, {
              lang: language,
              theme: "poimandres",
            })}
          />
        </div>
      </div>
    );
  },
);
