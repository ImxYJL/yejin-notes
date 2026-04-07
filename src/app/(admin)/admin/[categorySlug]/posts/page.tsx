import { CategorySlug } from '@/types/blog';
import { makeQueryClient } from '@/libs/tanstack/queryClient';
import { BLOG_QUERY_KEY } from '@/queries/queryKey';
import { PAGE_LIMIT } from '@/queries/usePosts';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getAdminPosts } from '@/services/postService';
import { AdminPostListContainer } from '@/app/(viewer)/components';
import { POST_FILTER } from '@/constants/blog';

type PostListPageParams = {
  categorySlug: CategorySlug;
};

export default async function AdminPostListPage({
  params,
}: {
  params: Promise<PostListPageParams>;
}) {
  const { categorySlug } = await params;
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [BLOG_QUERY_KEY.posts, categorySlug, POST_FILTER.all, 1],
    queryFn: () => getAdminPosts(categorySlug, 1, PAGE_LIMIT),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminPostListContainer categorySlug={categorySlug} />
    </HydrationBoundary>
  );
}
