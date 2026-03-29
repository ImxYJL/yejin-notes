import { PostDetail, PostDetailSkeleton } from '@/app/(viewer)/components';
import { CategorySlug } from '@/types/blog';
import { Suspense } from 'react';

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
      <PostDetail categorySlug={categorySlug} id={id} />
    </Suspense>
  );
};

export default PostDetailPage;
