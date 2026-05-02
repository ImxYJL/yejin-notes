import { PostItem as PostItemType } from '@/types/blog';
import PostItem from './PostItem';

type PostListProps = {
  postItems: PostItemType[];
  getPostHref: (post: PostItemType) => string;
};

const PostList = ({ postItems, getPostHref }: PostListProps) => {
  if (postItems.length === 0) {
    return (
      <section className="py-20 text-center text-muted-foreground">
        아직 작성된 글이 없습니다.
      </section>
    );
  }

  return (
    <ul className="divide-y divide-muted-foreground/30">
      {postItems.map((post) => (
        <PostItem key={post.id} post={post} href={getPostHref(post)} />
      ))}
    </ul>
  );
};

export default PostList;
