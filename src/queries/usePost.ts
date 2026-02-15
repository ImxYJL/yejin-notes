import { useSuspenseQuery } from "@tanstack/react-query";
import { BLOG_QUERY_KEY } from "./queryKey";
import { getPostApi } from "@/apis/posts";

const usePost = (postId: string, categoryName: string) => {
  return useSuspenseQuery({
    queryKey: [BLOG_QUERY_KEY.post, postId],
    queryFn: () => getPostApi(postId, categoryName),
    staleTime: 1000 * 60 * 60,
  });
};

export default usePost;
