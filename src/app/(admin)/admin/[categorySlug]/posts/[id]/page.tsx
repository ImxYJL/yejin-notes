import { PostAction } from '@/app/(viewer)/components/client';
import { PostDetail, PostDetailSkeleton } from '@/app/(viewer)/components/server';
import { checkIsAdmin } from '@/services/authService';
import { getAdminPostDetail } from '@/services/postService';
import { CategorySlug } from '@/types/blog';
import { AppError } from '@/utils/error';
import { Suspense } from 'react';

type PostDetailPageParams = {
  categorySlug: CategorySlug;
  id: string;
};

const AdminPostDetailPage = async ({
  params,
}: {
  params: Promise<PostDetailPageParams>;
}) => {
  const { categorySlug, id } = await params;

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) throw AppError.notFound();

  const post = await getAdminPostDetail(id);

  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostDetail
        post={post}
        categorySlug={categorySlug}
        actions={<PostAction id={post.id} categorySlug={categorySlug} />}
      />
    </Suspense>
  );
};

export default AdminPostDetailPage;
