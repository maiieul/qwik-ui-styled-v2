import {
  type ClassList,
  type PropsOf,
  component$,
  useStyles$,
} from "@qwik.dev/core";
import { CodeCopy } from "../code-copy/code-copy";
import { shiki } from "./shiki";
import highlightStyles from "./highlight.css?inline";

export type HighlightProps = PropsOf<"div"> & {
  code: string;
  canBeCopied?: boolean;
  copyCodeClass?: ClassList;
  language?: "tsx" | "html" | "css";
};

export const Highlight = component$(
  ({
    canBeCopied = true,
    code,
    copyCodeClass,
    language = "tsx",
    ...props
  }: HighlightProps) => {
    useStyles$(highlightStyles);
    return (
      <div class="relative">
        {canBeCopied && (
          <CodeCopy
            class={["absolute top-3 right-3", copyCodeClass]}
            code={code}
          />
        )}
        <div {...props} class={["highlight", props.class]}>
          <div
            class="[&>pre]:py-4 [&>pre]:pr-12 [&>pre]:pl-4"
            dangerouslySetInnerHTML={shiki.codeToHtml(code, {
              lang: language,
              themes: {
                light: "github-light",
                dark: "poimandres",
              },
              defaultColor: false,
            })}
          />
        </div>
      </div>
    );
  },
);
