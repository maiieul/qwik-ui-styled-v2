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
      <div class="rounded-base relative">
        <CodeCopy
          class={[
            "absolute top-3 right-3 text-white hover:bg-slate-800 hover:text-white",
            copyCodeClass,
          ]}
          code={code}
        />
        <div
          {...props}
          class={cn(
            "tab-size dark:from-background dark:to-accent/30 max-h-[494px] max-w-full overflow-auto rounded-sm text-sm",
            props.class,
          )}
        >
          <div
            class="[&>pre]:p-4"
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
