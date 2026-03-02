import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  CategorySlug,
  PostNavigation as PostNavigationType,
} from "@/types/blog";
import { PAGE_PATH } from "@/constants/paths";
import { cn } from "@/utils/styles";

type PostNavigationProps = {
  navigation: PostNavigationType;
  categorySlug: CategorySlug;
};

type NavItemProps = {
  direction: "prev" | "next";
  categorySlug: CategorySlug;
  post?: { id: string; title: string } | null;
};

const NavItem = ({ direction, categorySlug, post }: NavItemProps) => {
  const isPrev = direction === "prev";
  const Icon = isPrev ? ChevronLeft : ChevronRight;
  const label = isPrev ? "이전 글" : "다음 글";

  if (!post) {
    return (
      <div
        className={cn(
          "hidden sm:flex items-center gap-4 p-5 rounded-main opacity-40 grayscale",
          !isPrev && "justify-end text-right",
        )}
      >
        {isPrev && (
          <div className="shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Icon size={24} className="text-muted-foreground/50" />
          </div>
        )}
        <div className={cn("flex flex-col", !isPrev && "items-end")}>
          <p className="text-[11px] uppercase tracking-wider mb-1">{label}</p>
          <p className="text-sm font-medium">{label}이 없습니다.</p>
        </div>
        {!isPrev && (
          <div className="shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Icon size={24} className="text-muted-foreground/50" />
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={PAGE_PATH.postDetail(categorySlug, post.id)}
      className={cn(
        "group flex items-center gap-4 p-5 rounded-main transition-all duration-200 overflow-hidden",
        "text-muted-foreground hover:text-accent-primary hover:bg-accent-primary/10 active:bg-secondary/80",
        isPrev ? "text-left" : "justify-end text-right",
      )}
    >
      {isPrev && (
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-muted transition-colors group-hover:bg-background">
          <Icon size={24} className="text-inherit" />
        </div>
      )}
      <div className={cn("flex flex-col min-w-0", !isPrev && "items-end")}>
        <p className="text-[11px] uppercase tracking-wider mb-1 opacity-70">
          {label}
        </p>
        <p className="font-medium truncate text-inherit w-full">{post.title}</p>
      </div>
      {!isPrev && (
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-muted transition-colors group-hover:bg-background">
          <Icon size={24} className="text-inherit" />
        </div>
      )}
    </Link>
  );
};

const PostNavigation = ({ navigation, categorySlug }: PostNavigationProps) => {
  return (
    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <NavItem
        direction="prev"
        categorySlug={categorySlug}
        post={navigation.prevPost}
      />
      <NavItem
        direction="next"
        categorySlug={categorySlug}
        post={navigation.nextPost}
      />
    </nav>
  );
};

export default PostNavigation;
