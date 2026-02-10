import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import rehypeHighlight from "rehype-highlight";
import rehypePrettyCode from "rehype-pretty-code";
import remarkBreaks from "remark-breaks";
import { PluggableList } from "unified";
import { CODE_VIEWER_THEME } from "@/constants/theme";

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

/**
 * @param isEditor 에디터 모드 여부 (속도 중시)
 * @param selectedTheme 뷰어에서 사용할 Shiki 테마 이름
 */
export const getRehypePlugins = (
  isEditor: boolean,
  selectedTheme: string = CODE_VIEWER_THEME.light,
): PluggableList => {
  // 에디터용: 가벼운 highlight.js
  if (isEditor) return [remarkBreaks, rehypeHighlight];

  // 뷰어용: 추후 드롭다운 등으로 확장 가능한 pretty-code
  return [
    [
      rehypePrettyCode,
      {
        theme: selectedTheme,
        keepBackground: true, // 선택한 테마의 배경색을 유지
      },
    ],
  ];
};
