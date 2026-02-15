import { useQuery } from "@tanstack/react-query";
import { BLOG_QUERY_KEY } from "./queryKey";
import { getPostsApi } from "@/apis/posts";

const usePosts = (categoryName?: string) => {
  return useQuery({
    queryKey: [BLOG_QUERY_KEY.posts, categoryName],
    queryFn: () => getPostsApi(categoryName),
    staleTime: 1000 * 60 * 5,
  });
};

export default usePosts;
