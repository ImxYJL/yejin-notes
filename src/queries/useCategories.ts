import { getCategoriesApi } from "@/apis/category";
import { useQuery } from "@tanstack/react-query";
import { BLOG_QUERY_KEY } from "./queryKey";

export const useCategoryQuery = () => {
  return useQuery({
    queryKey: [BLOG_QUERY_KEY.categories],
    queryFn: getCategoriesApi,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
