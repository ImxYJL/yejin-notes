'use client';

import { CategorySlug } from '@/types/blog';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { PAGE_PATH } from '@/constants/paths';
import { getButtonStyles } from '@/components/common/Button';
import PostListLayout from '@/app/(viewer)/components/server/PostListLayout';
import { useAdminPosts } from '@/queries/usePosts';
import { useAllCategories } from '@/queries/useCategories';
import useCurrentPage from '@/hooks/useCurrentPage';

type Props = {
  categorySlug: CategorySlug;
};

const AdminPostListContainer = ({ categorySlug }: Props) => {
  const allData = useAllCategories();
  const categoryMap = allData?.categoryMap;

  const { page, handlePageChange } = useCurrentPage();
  const { data } = useAdminPosts(categorySlug, page);

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
