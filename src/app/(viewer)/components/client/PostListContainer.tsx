'use client';

import { CategorySlug } from '@/types/blog';
import { useState } from 'react';
import useCurrentCategory from '@/hooks/useCurrentCategory';
import PostListLayout from '../server/PostListLayout';
import { usePublicPosts } from '@/queries/usePosts';

type Props = {
  categorySlug: CategorySlug;
};

const PostListContainer = ({ categorySlug }: Props) => {
  const [page, setPage] = useState(1);
  const { categoryMap } = useCurrentCategory();
  const { data, isPending } = usePublicPosts(categorySlug, page);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!categoryMap) return null;

  return (
    <PostListLayout
      categorySlug={categorySlug}
      categoryName={categoryMap[categorySlug]?.name}
      postCount={data?.posts.length ?? 0}
      posts={data?.posts ?? []}
      isPending={isPending}
      currentPage={page}
      totalPages={data?.totalPages ?? 1}
      onPageChange={handlePageChange}
    />
  );
};

export default PostListContainer;
