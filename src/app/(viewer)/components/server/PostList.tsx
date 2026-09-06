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
    <div>
      <div
        className="flex items-center pb-3 border-b"
        style={{ borderColor: 'color-mix(in srgb, var(--color-accent), transparent 60%)' }}
      >
        <span className="font-mono text-xs uppercase tracking-widest opacity-50 flex-1">title</span>
        <span className="font-mono text-xs uppercase tracking-widest opacity-50 shrink-0">date</span>
      </div>
      <ul>
        {postItems.map((post) => (
          <PostItem key={post.id} post={post} href={getPostHref(post)} />
        ))}
      </ul>
    </div>
  );
};

export default PostList;
