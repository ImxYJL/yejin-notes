"use client";

import { PAGE_PATH } from "@/constants/paths";
import { CategorySlug, PostItem } from "@/types/blog";
import Link from "next/link";

type Props = {
  categorySlug: CategorySlug;
  postItems: PostItem[];
};

const PostList = ({ postItems, categorySlug }: Props) => (
  <div className="divide-y divide-border">
    {postItems.map((post) => (
      <Link
        key={post.id}
        href={PAGE_PATH.postDetail(categorySlug, post.id)}
        className="block py-10 group"
      >
        <article className="space-y-4">
          <h2 className="text-2xl font-bold group-hover:text-accent-primary base-transition tracking-tight">
            {post.title}
          </h2>
          <p className="text-muted-foreground line-clamp-2 leading-relaxed text-base">
            {post.summary}
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground/60 font-mono">
            <span>{post.createdAt}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
          </div>
        </article>
      </Link>
    ))}
  </div>
);

export default PostList;
