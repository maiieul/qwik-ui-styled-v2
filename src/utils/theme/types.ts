export type ThemeConfig = {
  mode: ThemeMode;
  style: ThemeStyle;
};

export type ThemeMode = "light" | "dark" | string;

export type ThemeStyle = "modern" | "qwik" | string;
