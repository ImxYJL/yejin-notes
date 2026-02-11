import rosePineDawn from "shiki/themes/rose-pine-dawn.mjs";
import nord from "shiki/themes/nord.mjs";

export const CODE_VIEWER_THEME = {
  rosePineDawn: rosePineDawn,
  nord: nord,
} as const;

export type CodeViewerThemeType =
  (typeof CODE_VIEWER_THEME)[keyof typeof CODE_VIEWER_THEME];
