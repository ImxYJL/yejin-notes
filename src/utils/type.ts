import { CATEGORY_MAP } from "@/constants/blog";
import { CategorySlug } from "@/types/blog";

/**
 * 파라미터로 전달받은 string이 유효한 CategorySlug인지 확인하는 가드 함수
 */
export const isCategorySlug = (slug: string | null): slug is CategorySlug => {
  if (!slug) return false;

  return Object.keys(CATEGORY_MAP).includes(slug);
};
