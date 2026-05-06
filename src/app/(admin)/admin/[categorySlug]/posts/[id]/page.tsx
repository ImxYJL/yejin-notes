import { PostAction } from '@/app/(viewer)/components/client';
import { PostDetail, PostDetailSkeleton } from '@/app/(viewer)/components/server';
import { checkIsAdmin } from '@/services/authService';
import { getCategoryBySlug } from '@/services/categoryService';
import { getAdminPostDetail } from '@/services/postService';
import { AppError } from '@/utils/error';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

type PostDetailPageParams = {
  categorySlug: string;
  id: string;
};

const AdminPostDetailPage = async ({
  params,
}: {
  params: Promise<PostDetailPageParams>;
}) => {
  const { categorySlug: rawCategorySlug, id } = await params;

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) throw AppError.notFound();

  const category = await getCategoryBySlug(rawCategorySlug);
  if (!category) throw AppError.notFound();

  const post = await getAdminPostDetail(id);

  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostDetail
        post={post}
        categorySlug={category.slug}
        actions={<PostAction id={post.id} categorySlug={category.slug} />}
      />
    </Suspense>
  );
};

export default AdminPostDetailPage;
