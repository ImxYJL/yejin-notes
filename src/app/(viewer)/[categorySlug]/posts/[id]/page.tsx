import { PostDetailSkeleton } from '@/app/(viewer)/components';
import PostDetailContainer from '@/app/(viewer)/components/PostDetailContainer';
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
      <PostDetailContainer categorySlug={categorySlug} id={id} />
    </Suspense>
  );
};

export default PostDetailPage;
