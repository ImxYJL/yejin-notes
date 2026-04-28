import { CategorySlug } from '@/types/blog';
import { makeQueryClient } from '@/libs/tanstack/queryClient';
import { BLOG_QUERY_KEY } from '@/queries/queryKey';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getAdminPosts } from '@/services/postService';
import { PAGE_LIMIT, POST_FILTER } from '@/constants/blog';
import { AdminPostListContainer } from '@/app/(viewer)/components/client';
import { getValidatedPage, validatePageBounds } from '@/utils/page';
import { PAGE_PATH } from '@/constants/paths';

export default async function AdminPostListPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: CategorySlug }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ categorySlug }, { page: rawPage }] = await Promise.all([
    params,
    searchParams,
  ]);
  const page = getValidatedPage(rawPage);

  const postsRes = await getAdminPosts(categorySlug, page, PAGE_LIMIT);

  validatePageBounds({
    postsLength: postsRes.posts.length,
    totalPages: postsRes.totalPages,
    currentPage: page,
    basePath: PAGE_PATH.admin.posts(categorySlug),
  });

  const queryClient = makeQueryClient();
  await queryClient.setQueryData(
    [BLOG_QUERY_KEY.posts, categorySlug, POST_FILTER.all, page],
    postsRes,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminPostListContainer categorySlug={categorySlug} />
    </HydrationBoundary>
  );
}
