import { getCategoriesApi } from "@/apis/category";
import { useQuery } from "@tanstack/react-query";
import { BLOG_QUERY_KEY } from "./queryKey";
import { Category, CategoryMap } from "@/types/blog";

const useCategories = () => {
  return useQuery({
    queryKey: [BLOG_QUERY_KEY.categories],
    queryFn: getCategoriesApi,
    staleTime: Infinity,
    gcTime: Infinity,
    select: (categories: Category[]) => {
      const categoryMap = categories.reduce((acc, category) => {
        acc[category.slug] = category;
        return acc;
      }, {} as CategoryMap);

      return { categories, categoryMap };
    },
  });
};

export default useCategories;
