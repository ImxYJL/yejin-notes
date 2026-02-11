export const CODE_VIEWER_THEME= {
  light: "base16-brush-trees-dark",
  nord: "nord",
} as const;

export type CodeViewerThemeType = keyof typeof CODE_VIEWER_THEME;
