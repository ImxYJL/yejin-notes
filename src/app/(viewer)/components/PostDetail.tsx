import { PostNavigation, PostAction } from "@/app/(viewer)/components";
import { Divider } from "@/components/common";
import { Lock, Clock, Tag } from "lucide-react";
import { CategorySlug, PostDetailResponse } from "@/types/blog";
import MarkdownViewer from "@/components/markdown/MarkdownViewer";
import { formatDate } from "@/utils/date";

type Props = {
  htmlContent: string;
  categorySlug: CategorySlug;
  post: PostDetailResponse;
  isAdmin: boolean;
};

const PostDetail = ({ categorySlug, htmlContent, isAdmin, post }: Props) => {
  return (
    <div className="space-y-16">
      <article>
        <header className="mb-4 space-y-2">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight max-w-[80%]">
              {post.title}
            </h1>

            <div className="flex flex-col gap-2 items-end">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0 pb-1">
                <Clock size={20} /> {formatDate(post.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              {post.isPrivate && (
                <span className="text-palette-0 font-bold bg-palette-0/10 px-2 py-0.5 rounded flex items-center justify-center">
                  <Lock size={20} />
                </span>
              )}
              {post.tags.length > 0 && (
                <>
                  <Tag size={20} />
                  {post.tags.map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}
                </>
              )}
            </span>

            <div className="flex items-center">
              {isAdmin && (
                <PostAction id={post.id} categorySlug={categorySlug} />
              )}
            </div>
          </div>
        </header>

        <Divider direction="horizontal" className="opacity-80 mb-12" />

        <section className="bg-background rounded-main">
          <MarkdownViewer htmlContent={htmlContent} />
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
