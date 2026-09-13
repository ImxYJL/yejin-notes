import rosePineDawn from 'shiki/themes/rose-pine-dawn.mjs';
import nord from 'shiki/themes/nord.mjs';

export const BLOG_THEMES = [
  { name: 'cream', color: '#a97b4d' },
  { name: 'forest', color: '#4f7a62' },
  { name: 'ocean', color: '#4e739a' },
] as const;

export type ThemeName = (typeof BLOG_THEMES)[number]['name'];

/** zustand persist가 테마를 저장하는 localStorage 키. layout.tsx의 FOUC 방지 스크립트와 공유한다. */
export const THEME_STORAGE_KEY = 'theme-storage';

export const CODE_VIEWER_THEME = {
  rosePineDawn: rosePineDawn,
  nord: nord,
} as const;

export type CodeViewerThemeType =
  (typeof CODE_VIEWER_THEME)[keyof typeof CODE_VIEWER_THEME];
