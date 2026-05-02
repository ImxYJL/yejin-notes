import { Category, CategoryMap } from '@/types/blog';

export const buildCategoryMap = (categories: Category[]): CategoryMap =>
  categories.reduce<CategoryMap>((acc, category) => {
    acc[category.slug] = category;
    return acc;
  }, {} as CategoryMap);
