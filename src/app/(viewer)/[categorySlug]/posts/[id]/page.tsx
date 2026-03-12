import { PostDetailSkeleton } from '@/app/(viewer)/components';
import PostDetailContainer from '@/app/(viewer)/components/PostDetailContainer';
import { getCategories } from '@/services/categoryService';
import { getPosts } from '@/services/postService';
import { CategorySlug } from '@/types/blog';
import { Suspense } from 'react';

export const generateStaticParams = async () => {
  const categories = await getCategories();
  const postParams = await Promise.all(
    categories.map(async (category) => {
      const { posts } = await getPosts(category.slug, 1, 100);

      return posts.map((post) => ({
        categorySlug: category.slug,
        id: post.id,
      }));
    }),
  );

  return postParams.flat();
};

// 빌드 타임에 없던 새 글은 요청 시점에 서버에서 생성
export const dynamicParams = true;

type PostDetailPageParams = {
  categorySlug: CategorySlug;
  id: string;
};

const PostDetailPage = async ({
  params,
}: {
  params: Promise<PostDetailPageParams>;
}) => {
  const { categorySlug, id } = await params;

  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostDetailContainer categorySlug={categorySlug} id={id} />
    </Suspense>
  );
};

export default PostDetailPage;
