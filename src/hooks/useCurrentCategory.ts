import { CategorySlug } from '@/types/blog';
import { usePublicCategories } from '@/queries/useCategories';
import useCurrentSlug from './useCurrentSlug';

const useCurrentCategory = () => {
  const { currentSlug, isActiveCategory } = useCurrentSlug();
  const publicData = usePublicCategories();

  const currentCategory =
    publicData?.categoryMap[currentSlug as CategorySlug] ?? null;

  return {
    currentSlug,
    currentCategory,
    categoryMap: publicData?.categoryMap,
    categories: publicData?.categories,
    isActiveCategory,
  };
};

export default useCurrentCategory;
