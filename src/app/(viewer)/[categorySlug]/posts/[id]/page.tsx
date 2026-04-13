import { getPublicCategories } from '@/services/categoryService';
import { getPublicPost, getPublicPosts } from '@/services/postService';
import { CategorySlug, PostDetailResponse } from '@/types/blog';
import { Suspense } from 'react';
import { PostDetail, PostDetailSkeleton } from '@/app/(viewer)/components/server';
import { redirect } from 'next/navigation';
import { PAGE_PATH } from '@/constants/paths';

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

  let post: PostDetailResponse | null = null;

  try {
    post = await getPublicPost(id);
  } catch {
    redirect(PAGE_PATH.admin.postDetail(categorySlug, id));
  }

  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostDetail post={post} categorySlug={categorySlug} />
    </Suspense>
  );
};

export default PostDetailPage;
