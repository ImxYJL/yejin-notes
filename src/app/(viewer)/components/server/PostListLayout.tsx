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
      {headerActions && <div className="mb-6 flex justify-end">{headerActions}</div>}

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
