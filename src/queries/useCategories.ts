import { getCategoriesApi } from '@/apis/category';
import { useQuery } from '@tanstack/react-query';
import { BLOG_QUERY_KEY } from './queryKey';
import { Category, CategoryMap } from '@/types/blog';
import { CATEGORY_FILTER } from '@/constants/blog';
import { buildCategoryMap } from '@/utils/posts/category';

type CategoryQueryResult = {
  categories: Category[];
  categoryMap: CategoryMap;
};

export const usePublicCategories = () => {
  const { data: publicData } = useQuery<Category[], Error, CategoryQueryResult>({
    queryKey: [BLOG_QUERY_KEY.categories, CATEGORY_FILTER.public],
    queryFn: getCategoriesApi,
    staleTime: Infinity,
    select: selectCategories,
  });

  return publicData;
};

export const useAllCategories = () => {
  const { data: allData } = useQuery<Category[], Error, CategoryQueryResult>({
    queryKey: [BLOG_QUERY_KEY.categories, CATEGORY_FILTER.all],
    queryFn: getCategoriesApi,
    staleTime: Infinity,
    select: selectCategories,
  });

  return allData;
};

const selectCategories = (categories: Category[]): CategoryQueryResult => {
  return { categories, categoryMap: buildCategoryMap(categories) };
};
