import { getCategoriesApi } from '@/apis/category';
import { useQuery } from '@tanstack/react-query';
import { BLOG_QUERY_KEY } from './queryKey';
import { Category, CategoryMap } from '@/types/blog';
import useIsAdmin from './auth/useIsAdmin';
import { CATEGORY_FILTER } from '@/constants/blog';

type CategoryQueryResult = {
  categories: Category[];
  categoryMap: CategoryMap;
};

const useCategories = () => {
  const { isAdmin } = useIsAdmin();

  return useQuery<Category[], Error, CategoryQueryResult>({
    queryKey: [
      BLOG_QUERY_KEY.categories,
      isAdmin ? CATEGORY_FILTER.all : CATEGORY_FILTER.public,
    ],
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
