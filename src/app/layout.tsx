import '@/app/globals.css';
import { Toast } from '@/components/common';
import { pretendard } from '@/libs/fonts';
import ClientProviders from '@/utils/providers/ClientProviders';
import { makeQueryClient } from '@/libs/tanstack/queryClient';
import { getAuthUser } from '@/services/authService';
import { getCategories } from '@/services/categoryService';
import { ADMIN_QUERY_KEY, BLOG_QUERY_KEY } from '@/queries/queryKey';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = makeQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [ADMIN_QUERY_KEY.authUser],
      queryFn: getAuthUser,
    }),
    queryClient.prefetchQuery({
      queryKey: [BLOG_QUERY_KEY.categories],
      queryFn: getCategories,
    }),
  ]);

  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <Toast />
        <ClientProviders>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </ClientProviders>
      </body>
    </html>
  );
}
