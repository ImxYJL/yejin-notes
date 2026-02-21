import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  CategorySlug,
  PostNavigation as PostNavigationType,
} from "@/types/blog";

type PostNavigationProps = {
  navigation: PostNavigationType;
  categorySlug: CategorySlug;
};

const PostNavigation = ({ navigation, categorySlug }: PostNavigationProps) => {
  const { prevPost, nextPost } = navigation;

  return (
    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full py-8">
      {/* 이전 글 */}
      {prevPost ? (
        <Link
          href={`/${categorySlug}/${prevPost.id}`}
          className="group flex items-center gap-4 p-5 rounded-main border border-border hover:bg-secondary/50 transition-all duration-200 text-left"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted group-hover:bg-background transition-colors">
            <ChevronLeft
              size={24}
              className="text-muted-foreground group-hover:text-foreground"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
              이전 글
            </span>
            <span className="font-semibold truncate group-hover:text-palette-0 transition-colors">
              {prevPost.title}
            </span>
          </div>
        </Link>
      ) : (
        <div className="hidden sm:flex items-center gap-4 p-5 rounded-main border border-dashed border-border opacity-50 cursor-not-allowed">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <ChevronLeft size={24} className="text-muted-foreground/50" />
          </div>
          <span className="text-sm text-muted-foreground">
            이전 기록이 없습니다.
          </span>
        </div>
      )}

      {/* 다음 글 */}
      {nextPost ? (
        <Link
          href={`/${categorySlug}/${nextPost.id}`}
          className="group flex items-center justify-end gap-4 p-5 rounded-main border border-border hover:bg-secondary/50 transition-all duration-200 text-right"
        >
          <div className="flex flex-col overflow-hidden items-end">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
              다음 글
            </span>
            <span className="font-semibold truncate group-hover:text-palette-0 transition-colors">
              {nextPost.title}
            </span>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted group-hover:bg-background transition-colors">
            <ChevronRight
              size={24}
              className="text-muted-foreground group-hover:text-foreground"
            />
          </div>
        </Link>
      ) : (
        <div className="hidden sm:flex items-center justify-end gap-4 p-5 rounded-main border border-dashed border-border opacity-50 cursor-not-allowed text-right">
          <span className="text-sm text-muted-foreground">
            다음 기록이 없습니다.
          </span>
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <ChevronRight size={24} className="text-muted-foreground/50" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default PostNavigation;
