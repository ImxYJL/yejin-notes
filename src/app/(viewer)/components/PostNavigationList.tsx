"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/styles";

type NavigationPost = {
  id: string;
  title: string;
  createdAt: string;
};

type Props = {
  category: string;
  currentPostId: string;
  posts: NavigationPost[];
};

const PostNavigationList = ({ category, currentPostId, posts }: Props) => {
  return (
    <section className="mt-20 border-t border-border pt-12 pb-20">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span className="capitalize">{category}</span> 카테고리의 다른 글
        </h3>
        <Link
          href={`/${category}/posts`}
          className="text-sm text-muted-foreground hover:text-palette-5 flex items-center gap-1 transition-colors"
        >
          전체보기 <ChevronRight size={14} />
        </Link>
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-50">
          {posts.map((post) => {
            const isCurrent = post.id === currentPostId;

            return (
              <Link
                key={post.id}
                href={`/${category}/posts/${post.id}`}
                className={cn(
                  "flex justify-between items-center p-5 transition-colors group",
                  isCurrent ? "bg-palette-9/10" : "hover:bg-gray-50",
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {isCurrent && (
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-palette-5 animate-pulse" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium truncate transition-colors",
                      isCurrent
                        ? "text-palette-5 font-bold"
                        : "group-hover:text-palette-5",
                    )}
                  >
                    {post.title}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 font-mono">
                  {post.createdAt}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PostNavigationList;
