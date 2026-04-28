import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { BLOG_QUERY_KEY } from './queryKey';
import { CategorySlug } from '@/types/blog';
import { getAdminPostsApi, getPublicPostsApi } from '@/apis/posts';
import { PAGE_LIMIT, POST_FILTER } from '@/constants/blog';

/**
 * 일반 사용자용 공개 포스트 목록 조회 훅
 */
export const usePublicPosts = (categorySlug: CategorySlug, page: number) => {
  return useQuery({
    queryKey: [BLOG_QUERY_KEY.posts, categorySlug, POST_FILTER.public, page],
    queryFn: () =>
      getPublicPostsApi(categorySlug, {
        page,
        limit: PAGE_LIMIT,
      }),
    staleTime: 1000 * 60 * 5, // 5분
    placeholderData: keepPreviousData,
  });
};

/**
 * 관리자용 전체 포스트 목록 조회 훅 (비공개 포함)
 */
export const useAdminPosts = (categorySlug: CategorySlug, page: number) => {
  return useQuery({
    queryKey: [BLOG_QUERY_KEY.posts, categorySlug, POST_FILTER.all, page],
    queryFn: () =>
      getAdminPostsApi(categorySlug, {
        page,
        limit: PAGE_LIMIT,
      }),
    staleTime: 1000 * 60 * 1,
    placeholderData: keepPreviousData,
  });
};
