import { QUERY_PARAMS } from '@/constants/system';
import { redirect } from 'next/navigation';

/**
 * 1. 문자열, NaN, 소수점 -> 1로 Fallback
 * 2. 0 또는 음수 -> 1로 Fallback
 * 3. 정상 숫자 -> Number 변환
 */
export const START_PAGE_NUM = 1;
const FALLBACK_PAGE_NUM = 1;

export const getValidatedPage = (
  pageParam: string | string[] | undefined | null,
): number => {
  // 파라미터가 없거나 배열인 경우(잘못된 접근) 예외 처리
  if (!pageParam || Array.isArray(pageParam)) return FALLBACK_PAGE_NUM;

  const parsedPage = Number(pageParam);
  // 숫자 검증 (NaN, 1미만, 혹은 소수점인 경우)
  if (
    isNaN(parsedPage) ||
    parsedPage < START_PAGE_NUM ||
    !Number.isInteger(parsedPage)
  ) {
    return FALLBACK_PAGE_NUM;
  }

  return parsedPage;
};

type PageGuardProps = {
  postsLength: number;
  totalPages: number;
  currentPage: number;
  basePath: string;
};

/**
 * 유효하지 않은 페이지 접근(글이 없는데 페이지 번호만 큰 경우)
 * -> 마지막 유효 페이지로 리다이렉트
 */
export const validatePageBounds = ({
  postsLength,
  totalPages,
  currentPage,
  basePath,
}: PageGuardProps) => {
  // 1페이지는 글이 아예 없을 수도 있으므로 제외 (page > 1)
  if (postsLength === 0 && totalPages > 0 && currentPage > START_PAGE_NUM) {
    redirect(`${basePath}?${QUERY_PARAMS.page}=${totalPages}`);
  }
};
