import { useQuery } from "@tanstack/react-query";
import { BLOG_QUERY_KEY } from "./queryKey";
import { getDraftsApi } from "@/apis/posts";

const useDrafts = (isOpen: boolean) => {
  return useQuery({
    queryKey: [BLOG_QUERY_KEY.drafts],
    queryFn: getDraftsApi,
    staleTime: 1000 * 60 * 60,
    enabled: isOpen,
  });
};

export default useDrafts;
