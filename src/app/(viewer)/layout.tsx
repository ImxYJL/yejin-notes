import { cn } from '@/utils/styles';
import Sidebar from '@/components/common/Sidebar';
import { checkIsAdmin } from '@/services/authService';
import { getCategories } from '@/services/categoryService';
import { makeQueryClient } from '@/libs/tanstack/queryClient';
import { ADMIN_QUERY_KEY, BLOG_QUERY_KEY } from '@/queries/queryKey';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

const ViewerLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = makeQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [ADMIN_QUERY_KEY.isAdmin],
      queryFn: checkIsAdmin,
    }),
    queryClient.prefetchQuery({
      queryKey: [BLOG_QUERY_KEY.categories],
      queryFn: getCategories,
    }),
  ]);

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
