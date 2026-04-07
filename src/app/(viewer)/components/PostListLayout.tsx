'use client';

import { CategorySlug } from '@/types/blog';
import { PostItem } from '@/types/blog';
import PostList from './PostList';
import PostSkeleton from './PostSkeleton';
import PostListPagination from './PostListPagination';

type Props = {
  categorySlug: CategorySlug;
  categoryName?: string;
  postCount: number;
  posts: PostItem[];
  isPending: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  actions?: React.ReactNode;
};

const PostListLayout = ({
  categorySlug,
  categoryName,
  postCount,
  posts,
  isPending,
  currentPage,
  totalPages,
  onPageChange,
  actions,
}: Props) => {
  return (
    <div>
      <header className="flex justify-between items-end border-b-2 border-muted-foreground/30 border-border pb-8">
        <div>
          <h1 className="text-3xl font-black capitalize tracking-tight">
            {categoryName}
          </h1>
          <p className="text-muted-foreground mt-3 font-medium">
            <span className="text-accent-primary font-bold">{postCount}개</span>의
            기록이 있습니다.
          </p>
        </div>
        {actions}
      </header>

      {isPending ? (
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <PostList categorySlug={categorySlug} postItems={posts} />
          {totalPages > 1 && (
            <PostListPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PostListLayout;
