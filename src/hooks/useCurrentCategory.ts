import { usePathname } from "next/navigation";
import { CategorySlug } from "@/types/blog";
import useCategories from "@/queries/useCategories";

const useCurrentCategory = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentSlug = segments[0] as CategorySlug;

  const { data, isPending } = useCategories();
  const currentCategory = data?.categoryMap[currentSlug];

  return {
    isPending,
    currentSlug,
    currentCategory,
    categoryMap: data?.categoryMap,
    categories: data?.categories,
    isActiveCategory: (slug: string) => currentSlug === slug,
  };
};

export default useCurrentCategory;
