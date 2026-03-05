import { CATEGORY_MAP } from "@/constants/blog";
import { CategorySlug } from "@/types/blog";
import React from "react";
import { ReactElement, ReactNode } from "react";

/**
 * 파라미터로 전달받은 string이 유효한 CategorySlug인지 확인하는 가드 함수
 */
export const isCategorySlug = (slug: string | null): slug is CategorySlug => {
  if (!slug) return false;

  return Object.keys(CATEGORY_MAP).includes(slug);
};

/**
 * 노드에 유효한 children이 있는지 확인하는 타입 가드
 */
export const hasChildren = (
  node: ReactNode
): node is ReactElement<{ children: ReactNode }> => {
  // 1. 기본 검증: 유효한 리액트 요소가 아니면 즉시 종료 (Early Return)
  if (!React.isValidElement(node)) return false;

  // 2. 타입 검증: props가 객체이고 children 키를 가졌는지 최종 확인
  return (
    typeof node.props === "object" &&
    node.props !== null &&
    "children" in node.props
  );
};