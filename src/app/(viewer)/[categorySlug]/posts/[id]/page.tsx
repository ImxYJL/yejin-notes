import { PostDetail, PostDetailSkeleton } from '@/app/(viewer)/components';
import { checkIsAdmin } from '@/services/authService';
import { getPublicCategories } from '@/services/categoryService';
import { getAdminPost, getPublicPost, getPublicPosts } from '@/services/postService';
import { CategorySlug, PostDetailResponse } from '@/types/blog';
import { Suspense } from 'react';
import { AppError } from '@/utils/error';

export async function generateStaticParams() {
  const categories = await getPublicCategories();

  // 카테고리별로 공개 글 id 수집
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

// 관리자가 비공개 글 접근 시 SSR fallback
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

  let post: PostDetailResponse;

  try {
    post = await getPublicPost(id);
  } catch {
    // 여기 떨어지는 건 비공개 글 → 어차피 dynamic
    const isAdmin = await checkIsAdmin(); // cookies() 여기서만 호출
    if (!isAdmin) AppError.notFound();

    post = await getAdminPost(id);
  }

  return <PostDetail post={post} categorySlug={categorySlug} />;
};

export default PostDetailPage;
