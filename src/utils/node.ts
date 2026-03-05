import { ReactNode } from "react";
import { hasChildren } from "./type";

/**
 * 노드 트리 내에서 실제 내용이 있는 첫 번째 텍스트를 재귀적으로 찾아 반환
 */
export const getFirstText = (node: ReactNode): string => {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);

  // 배열인 경우 모든 자식을 순회하며 텍스트를 찾을 때까지 파고듦
  if (Array.isArray(node)) {
    for (const child of node) {
      const text = getFirstText(child);
      if (text.trim()) return text;
    }
  }

  // 엘리먼트인 경우 props.children 탐색
  if (hasChildren(node)) {
    return getFirstText(node.props.children);
  }

  return "";
};
