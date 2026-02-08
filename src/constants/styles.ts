// src/constants/styles.ts (이름을 constants 폴더로 옮기는 것도 추천합니다)

export const LAYOUT_CONFIG = {
  sidebarWidth: 280,
  headerHeight: 56,
  contentMaxWidth: 896,
} as const;

export const BREAK_POINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

// JS/Framer Motion용 숫자 기반 설정
export const ANIMATION_VALUE = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1], // Cubic-bezier
} as const;

// 타입 추출 (기존 방식 유지)
export type SidebarWidth = typeof LAYOUT_CONFIG.sidebarWidth;
