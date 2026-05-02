import { PostItem as PostItemType } from '@/types/blog';
import { ReactNode } from 'react';
import PostList from './PostList';
import PostListPagination from './PostListPagination';

type Props = {
  categoryName?: string;
  postCount: number;
  postItems: PostItemType[];
  currentPage: number;
  totalPages: number;
  getPostHref: (post: PostItemType) => string;
  getPageHref: (page: number) => string;
  headerActions?: ReactNode;
};

const PostListLayout = ({
  categoryName,
  postCount,
  postItems,
  currentPage,
  totalPages,
  getPostHref,
  getPageHref,
  headerActions,
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

        {headerActions}
      </header>

      <div>
        <PostList postItems={postItems} getPostHref={getPostHref} />

        {totalPages > 1 && (
          <PostListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            getPageHref={getPageHref}
          />
        )}
      </div>
    </div>
  );
};

export default PostListLayout;
