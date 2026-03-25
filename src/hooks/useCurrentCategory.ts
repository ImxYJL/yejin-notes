import { usePathname } from 'next/navigation';
import { CategorySlug } from '@/types/blog';
import useCategories from '@/queries/useCategories';
import useIsAdmin from '@/queries/auth/useIsAdmin';

const useCurrentCategory = () => {
  const pathname = usePathname();
  const { data } = useCategories();
  const { isAdmin } = useIsAdmin();

  const segments = pathname.split('/').filter(Boolean);
  const currentSlug = segments[0] ?? '';
  const currentCategory = data?.categoryMap[currentSlug as CategorySlug] ?? null;

  const visibleCategories = isAdmin
    ? data?.categories
    : data?.categories.filter((c) => !c.isPrivate);

  return {
    currentSlug,
    currentCategory,
    categoryMap: data?.categoryMap,
    categories: data?.categories,
    visibleCategories,
    isActiveCategory: (slug: string) => currentSlug === slug,
  };
};

export default useCurrentCategory;
