import { createContextId } from "@qwik.dev/core";
import { UseThemeProps } from "./types";

export const ThemeContext = createContextId<UseThemeProps>("theme-context");
