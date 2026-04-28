'use client';

import { CategorySlug } from '@/types/blog';
import PostListLayout from '../server/PostListLayout';
import { usePublicPosts } from '@/queries/usePosts';
import useCurrentPage from '@/hooks/useCurrentPage';
import { usePublicCategories } from '@/queries/useCategories';

type Props = {
  categorySlug: CategorySlug;
};

const PostListContainer = ({ categorySlug }: Props) => {
  const publicData = usePublicCategories();
  const categoryMap = publicData?.categoryMap;

  const { page, handlePageChange } = useCurrentPage();
  const { data } = usePublicPosts(categorySlug, page);

  if (!categoryMap || !data) return null;

  return (
    <PostListLayout
      categorySlug={categorySlug}
      categoryName={categoryMap[categorySlug]?.name ?? ''}
      postCount={data.posts.length}
      posts={data.posts}
      currentPage={page}
      totalPages={data.totalPages}
      onPageChange={handlePageChange}
    />
  );
};

export default PostListContainer;
