import {
  getPublicCategories,
  getPublicCategoryBySlug,
} from '@/services/categoryService';
import { getPublicPostDetail, getPublicPosts } from '@/services/postService';
import { Suspense } from 'react';
import { PostDetail, PostDetailSkeleton } from '@/app/(viewer)/components/server';
import { notFound } from 'next/navigation';
import { isAppError } from '@/utils/error';

export async function generateStaticParams() {
  const categories = await getPublicCategories();

  const results = await Promise.all(
    categories.map(async (c) => {
      const { posts } = await getPublicPosts(c.slug);
      return posts.map((p) => ({
        categorySlug: c.slug,
        id: String(p.id),
      }));
    }),
  );

  return results.flat();
}

type PostDetailPageParams = {
  categorySlug: string;
  id: string;
};

const PostDetailPage = async ({
  params,
}: {
  params: Promise<PostDetailPageParams>;
}) => {
  const { categorySlug: rawCategorySlug, id } = await params;

  const category = await getPublicCategoryBySlug(rawCategorySlug).catch(() =>
    notFound(),
  );

  const post = await getPublicPostDetail(id).catch((e) => {
    if (isAppError(e) && e.code === 'NOT_FOUND') notFound();
    throw e;
  });

  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostDetail post={post} categorySlug={category.slug} />
    </Suspense>
  );
};

export default PostDetailPage;
