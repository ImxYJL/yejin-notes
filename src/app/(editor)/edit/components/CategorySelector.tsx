import { Badge } from "@/components/common";
import { CATEGORY_KEYS, CATEGORY_MAP } from "@/constants/blog";
import { CategorySlug } from "@/types/blog";

type Props = {
  categorySlug: CategorySlug;
  onSelect: (slug: CategorySlug) => void;
};

const CategorySelector = ({ categorySlug, onSelect }: Props) => (
  <ul className="flex items-center gap-2">
    {CATEGORY_KEYS.map((slug) => {
      const { name } = CATEGORY_MAP[slug];
      const isSelected = categorySlug === slug;

      return (
        <li key={slug}>
          <button type="button" onClick={() => onSelect(slug)}>
            <Badge label={name} isSelected={isSelected} className={'cursor-pointer'}/>
          </button>
        </li>
      );
    })}
  </ul>
);

export default CategorySelector;
