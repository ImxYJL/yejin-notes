import { useSuspenseQuery } from "@tanstack/react-query";
import { BLOG_QUERY_KEY } from "./queryKey";
import { getPostApi } from "@/apis/posts";
import { CategorySlug } from "@/types/blog";

const usePost = (postId: string, categorySlug: CategorySlug) => {
  return useSuspenseQuery({
    queryKey: [BLOG_QUERY_KEY.post, postId],
    queryFn: () => getPostApi(postId, categorySlug),
    staleTime: 1000 * 60 * 60,
  });
};

export default usePost;
