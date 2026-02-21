// 현재 미사용
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/styles";
import { CategorySlug } from "@/types/blog";
import { CATEGORY_MAP } from "@/constants/blog";
import { PAGE_PATH } from "@/constants/paths";

// TODO: 타입 같은 거 쓰기
type NavigationPost = {
  id: string;
  title: string;
  createdAt: string;
};

type Props = {
  categorySlug: CategorySlug;
  currentPostId: string;
  posts: NavigationPost[];
};

const PostNavigationList = ({ categorySlug, currentPostId, posts }: Props) => {
  return (
    <section className="pt-14 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span className="capitalize text-accent-primary">
            {CATEGORY_MAP[categorySlug].name}
          </span>
          카테고리의 다른 글
        </h3>
        <Link
          href={PAGE_PATH.posts(categorySlug)}
          className="text-sm text-muted-foreground hover:text-accent-primary flex items-center gap-1 base-transition"
        >
          전체보기 <ChevronRight size={14} />
        </Link>
      </div>

      <nav className="bg-background overflow-hidden">
        <ul className="divide-y divide-muted-foreground/40">
          {posts.map((post) => {
            const isCurrent = post.id === currentPostId;

            return (
              <li key={post.id}>
                <Link
                  href={PAGE_PATH.postDetail(categorySlug, post.id)}
                  className={cn(
                    "flex justify-between items-center p-5 base-transition group",
                    isCurrent ? "bg-accent-primary/5" : "hover:bg-muted/30",
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {isCurrent && (
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium truncate base-transition",
                        isCurrent
                          ? "text-accent-primary font-bold"
                          : "group-hover:text-accent-primary",
                      )}
                    >
                      {post.title}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 font-mono">
                    {post.createdAt}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
};

export default PostNavigationList;
