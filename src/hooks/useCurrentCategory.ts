import { CategorySlug } from '@/types/blog';
import useCategories from '@/queries/useCategories';
import useCurrentSlug from './useCurrentSlug';

const useCurrentCategory = () => {
  const { currentSlug, isActiveCategory } = useCurrentSlug();
  const { data } = useCategories();

  const currentCategory = data?.categoryMap[currentSlug as CategorySlug] ?? null;

  return {
    currentSlug,
    currentCategory,
    categoryMap: data?.categoryMap,
    categories: data?.categories,
    isActiveCategory,
  };
};

export default useCurrentCategory;
