import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { createHighlighter } from "shiki/bundle/web";

export const shiki = await createHighlighter({
  themes: ["poimandres", "github-light"],
  langs: ["tsx", "html", "css"],
  engine: createJavaScriptRegexEngine(),
});
