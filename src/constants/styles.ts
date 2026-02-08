export const LAYOUT_CONFIG = {
  sidebarWidth: 280,
  headerHeight: 56,
  contentMaxWidth: 896,
} as const;

export const BREAK_POINTS = {
  mobile: 768,
} as const;

export const ANIMATION_CONFIG = {
  default: "duration-300 ease-in-out",
} as const;

export type SidebarWidth = typeof LAYOUT_CONFIG.sidebarWidth;