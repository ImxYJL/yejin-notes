import rosePineDawn from 'shiki/themes/rose-pine-dawn.mjs';
import nord from 'shiki/themes/nord.mjs';

export const BLOG_THEMES = [
  { name: 'cream', color: '#a97b4d' },
  { name: 'forest', color: '#4f7a62' },
  { name: 'ocean', color: '#4e739a' },
] as const;

export type ThemeName = (typeof BLOG_THEMES)[number]['name'];

export const CODE_VIEWER_THEME = {
  rosePineDawn: rosePineDawn,
  nord: nord,
} as const;

export type CodeViewerThemeType =
  (typeof CODE_VIEWER_THEME)[keyof typeof CODE_VIEWER_THEME];
