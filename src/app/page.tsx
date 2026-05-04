import { cn } from '@/utils/styles';
import Sidebar from '@/components/common/Sidebar';
import { PAGE_PATH } from '@/constants/paths';
import { getPublicCategories } from '@/services/categoryService';

export default async function Home() {
  const categories = await getPublicCategories();
  const categoriesWithHref = categories.map((c) => ({
    ...c,
    href: PAGE_PATH.posts(c.slug),
  }));

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar categories={categoriesWithHref} selectedSlug={null} />

      <main
        className={cn(
          'flex-1 min-w-0 min-h-screen base-transition flex flex-col overflow-y-auto',
          'mx-auto pb-20 pt-20',
          'max-w-content w-full',
          'px-6 md:px-16 lg:px-24 xl:px-32',
        )}
      ></main>
    </div>
  );
}
