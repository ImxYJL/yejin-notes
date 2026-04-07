import { cn } from '@/utils/styles';
import Sidebar from '@/components/common/Sidebar';
import { getAllCategories } from '@/services/categoryService';
import { makeQueryClient } from '@/libs/tanstack/queryClient';
import { BLOG_QUERY_KEY } from '@/queries/queryKey';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { CATEGORY_FILTER } from '@/constants/blog';
import { Category } from '@/types/blog';
import { PAGE_PATH } from '@/constants/paths';

const ViewerLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = makeQueryClient();

  const categories = await queryClient.fetchQuery<Category[]>({
    queryKey: [BLOG_QUERY_KEY.categories, CATEGORY_FILTER.all],
    queryFn: getAllCategories,
  });
  const categoriesWithHref = categories.map((c) => ({
    ...c,
    href: c.isPrivate ? PAGE_PATH.admin.posts(c.slug) : PAGE_PATH.posts(c.slug),
  }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
    </HydrationBoundary>
  );
};

export default ViewerLayout;
