import { cn } from '@/utils/styles';
import Sidebar from '@/components/common/Sidebar';
import { getAllCategories } from '@/services/categoryService';
import { PAGE_PATH } from '@/constants/paths';

const ViewerLayout = async ({ children }: { children: React.ReactNode }) => {
  const categories = await getAllCategories();
  const categoriesWithHref = categories.map((c) => ({
    ...c,
    href: PAGE_PATH.admin.posts(c.slug),
  }));

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar categories={categoriesWithHref} />

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
