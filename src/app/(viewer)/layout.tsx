import { cn } from '@/utils/styles';
import Sidebar from '@/components/common/Sidebar';
import { getPublicCategories } from '@/services/categoryService';
import { makeQueryClient } from '@/libs/tanstack/queryClient';
import { BLOG_QUERY_KEY } from '@/queries/queryKey';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { CATEGORY_FILTER } from '@/constants/blog';

const ViewerLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [BLOG_QUERY_KEY.categories, CATEGORY_FILTER.public],
    queryFn: getPublicCategories,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

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
