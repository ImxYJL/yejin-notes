import { Lock } from 'lucide-react';
import { Divider } from '@/components/common';
import { CategorySlug, PostDetailResponse } from '@/types/blog';
import { formatDate } from '@/utils/date';
import { getMarkdownComponent } from '@/utils/markdowns/style';
import { MarkdownViewer } from '@/components/markdown';
import PostNavigation from './PostNavigation';

type Props = {
  categorySlug: CategorySlug;
  post: PostDetailResponse;
  actions?: React.ReactNode;
};

const PostDetail = async ({ categorySlug, post, actions }: Props) => {
  const contentNode = await getMarkdownComponent(post.content);

  return (
    <div className="space-y-16">
      <article>
        <header className="post-header">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider opacity-60">
            <div className="flex items-center gap-2">
              <span>{formatDate(post.createdAt)}</span>
              {post.isPrivate && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Lock size={12} />
                    비공개
                  </span>
                </>
              )}
            </div>
            {actions}
          </div>

          <h1 className="mt-4 text-4xl leading-tight tracking-tight">
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm opacity-60">
              {post.tags.map((tag, i) => (
                <span key={i}>#{tag}</span>
              ))}
            </div>
          )}
        </header>

        <section className="bg-background rounded-main">
          <MarkdownViewer contentNode={contentNode} />
        </section>
      </article>

      <Divider direction="horizontal" className="opacity-80" />

      <PostNavigation
        navigation={{ prevPost: post.prevPost, nextPost: post.nextPost }}
        categorySlug={categorySlug}
      />
    </div>
  );
};

export default PostDetail;
