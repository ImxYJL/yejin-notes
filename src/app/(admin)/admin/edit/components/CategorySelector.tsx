'use client';

import { Badge } from '@/components/common';
import { CATEGORY_KEYS } from '@/constants/blog';
import { useAllCategories } from '@/queries/useCategories';
import { CategorySlug } from '@/types/blog';

type Props = {
  categorySlug: CategorySlug;
  onSelect: (slug: CategorySlug) => void;
};

const CategorySelector = ({ categorySlug, onSelect }: Props) => {
  const allData = useAllCategories();
  const categoryMap = allData?.categoryMap;

  if (!categoryMap) return null;

  return (
    <ul className="flex items-center gap-2">
      {CATEGORY_KEYS.map((slug) => {
        const { name } = categoryMap[slug];
        const isSelected = categorySlug === slug;

        return (
          <li key={slug}>
            <button type="button" onClick={() => onSelect(slug)}>
              <Badge
                label={name}
                isSelected={isSelected}
                className={'cursor-pointer'}
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default CategorySelector;
