import { useSuspenseQuery } from "@tanstack/react-query";
import { BLOG_QUERY_KEY } from "./queryKey";
import { getPostsApi } from "@/apis/posts";

export const PAGE_LIMIT = 10;

const usePosts = (categorySlug: string, page: number) => {
  return useSuspenseQuery({
    queryKey: [BLOG_QUERY_KEY.posts, categorySlug, page],
    queryFn: () =>
      getPostsApi(categorySlug, {
        page,
        limit: PAGE_LIMIT,
      }),
    staleTime: 1000 * 60 * 5,
  });
};

export default usePosts;
