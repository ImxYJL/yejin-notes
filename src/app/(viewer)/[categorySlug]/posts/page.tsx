import { CategorySlug } from '@/types/blog';
import { PostListContainer } from '../../components/client';
import { makeQueryClient } from '@/libs/tanstack/queryClient';
import { BLOG_QUERY_KEY } from '@/queries/queryKey';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getPublicCategories } from '@/services/categoryService';
import { getPublicPosts } from '@/services/postService';
import { PAGE_LIMIT, POST_FILTER } from '@/constants/blog';
import { getValidatedPage, validatePageBounds } from '@/utils/page';
import { PAGE_PATH } from '@/constants/paths';

export async function generateStaticParams() {
  const categories = await getPublicCategories();

  return categories.map((c) => ({
    categorySlug: c.slug,
  }));
}

const PostListPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: CategorySlug }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const [{ categorySlug }, { page: rawPage }] = await Promise.all([
    params,
    searchParams,
  ]);
  const page = getValidatedPage(rawPage);

  const postsRes = await getPublicPosts(categorySlug, page, PAGE_LIMIT);

  validatePageBounds({
    postsLength: postsRes.posts.length,
    totalPages: postsRes.totalPages,
    currentPage: page,
    basePath: PAGE_PATH.posts(categorySlug),
  });

  const queryClient = makeQueryClient();
  await queryClient.setQueryData(
    [BLOG_QUERY_KEY.posts, categorySlug, POST_FILTER.public, page],
    postsRes,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostListContainer categorySlug={categorySlug} />
    </HydrationBoundary>
  );
};

export default PostListPage;
