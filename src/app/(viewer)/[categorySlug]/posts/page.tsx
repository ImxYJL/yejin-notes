import { CategorySlug } from '@/types/blog';
import { PostListContainer } from '../../components';
import { makeQueryClient } from '@/libs/tanstack/queryClient';
import { BLOG_QUERY_KEY } from '@/queries/queryKey';
import { PAGE_LIMIT } from '@/queries/usePosts';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getPublicCategories } from '@/services/categoryService';
import { getPublicPosts } from '@/services/postService';

export async function generateStaticParams() {
  const categories = await getPublicCategories();

  return categories.map((c) => ({
    categorySlug: c.slug,
  }));
}

type PostListPageParams = {
  categorySlug: CategorySlug;
};

const PostListPage = async ({ params }: { params: Promise<PostListPageParams> }) => {
  const { categorySlug } = await params;
  const queryClient = makeQueryClient();
  const page = Number(1); // TODO: queryParams를 기준으로 하도록 리팩토링

  await queryClient.prefetchQuery({
    queryKey: [BLOG_QUERY_KEY.posts, categorySlug, page],
    queryFn: () => getPublicPosts(categorySlug, page, PAGE_LIMIT),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostListContainer categorySlug={categorySlug} />
    </HydrationBoundary>
  );
};

export default PostListPage;
