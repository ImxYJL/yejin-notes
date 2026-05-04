import { cn } from '@/utils/styles';
import Sidebar from '@/components/common/Sidebar';
import { getAllCategories, getCategoryBySlug } from '@/services/categoryService';
import { PAGE_PATH } from '@/constants/paths';
import { AppError } from '@/utils/error';

const ViewerLayout = async ({
  params,
  children,
}: {
  params: Promise<{ categorySlug: string }>;
  children: React.ReactNode;
}) => {
  const categories = await getAllCategories();
  const categoriesWithHref = categories.map((c) => ({
    ...c,
    href: PAGE_PATH.admin.posts(c.slug),
  }));

  const { categorySlug } = await params;

  const category = await getCategoryBySlug(categorySlug);
  if (!category) throw AppError.notFound();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar categories={categoriesWithHref} selectedSlug={category.slug} />

      <main
        className={cn(
          'flex-1 min-w-0 min-h-screen base-transition flex flex-col overflow-y-auto',
          'mx-auto pb-20 pt-20',
          'max-w-content w-full',
          'px-6 md:px-16 lg:px-24 xl:px-32',
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default ViewerLayout;
