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

const usePublicCategories = () => {
  const { data: publicData } = useQuery<Category[], Error, CategoryQueryResult>({
    queryKey: [BLOG_QUERY_KEY.categories, CATEGORY_FILTER.public],
    queryFn: getCategoriesApi,
    staleTime: Infinity,
    select: selectCategories,
  });

  return publicData;
};

const useAllCategories = (enabled: boolean) => {
  const { data: allData } = useQuery<Category[], Error, CategoryQueryResult>({
    queryKey: [BLOG_QUERY_KEY.categories, CATEGORY_FILTER.all],
    queryFn: getCategoriesApi,
    enabled: enabled === true,
    staleTime: Infinity,
    select: selectCategories,
  });

  return allData;
};

const selectCategories = (categories: Category[]): CategoryQueryResult => {
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.slug] = category;
    return acc;
  }, {} as CategoryMap);

  return { categories, categoryMap };
};

const useCategories = () => {
  const { isAdmin } = useIsAdmin();

  const publicData = usePublicCategories();
  const allData = useAllCategories(isAdmin);

  return { data: allData ?? publicData };
};

export default useCategories;
