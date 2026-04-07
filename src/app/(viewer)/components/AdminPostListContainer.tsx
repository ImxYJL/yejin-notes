'use client';

import { CategorySlug } from '@/types/blog';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import useCurrentCategory from '@/hooks/useCurrentCategory';
import { PAGE_PATH } from '@/constants/paths';
import { getButtonStyles } from '@/components/common/Button';
import PostListLayout from './PostListLayout';
import { useAdminPosts } from '@/queries/usePosts';

type Props = {
  categorySlug: CategorySlug;
};

const AdminPostListContainer = ({ categorySlug }: Props) => {
  const [page, setPage] = useState(1);
  const { categoryMap } = useCurrentCategory();
  const { data, isPending } = useAdminPosts(categorySlug, page);

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
      actions={
        <Link
          href={PAGE_PATH.admin.write}
          className={getButtonStyles('primary', 'md', 'font-bold')}
        >
          <Plus size={24} />
        </Link>
      }
    />
  );
};

export default AdminPostListContainer;
