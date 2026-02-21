"use client";

import { CATEGORY_MAP } from "@/constants/blog";
import { PAGE_PATH } from "@/constants/paths";
import { CategorySlug } from "@/types/blog";
import { Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import usePosts from "@/queries/usePosts";
import PostListPagination from "./PostListPagination";
import { getButtonStyles } from "@/components/common/Button";
import PostList from "./PostList";
import PostSkeleton from "./PostSkeleton";

type Props = {
  categorySlug: CategorySlug;
};

const PostListContainer = ({ categorySlug }: Props) => {
  const [page, setPage] = useState(1);

  const { data, isPending } = usePosts(categorySlug, page);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      <header className="flex justify-between items-end border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black capitalize tracking-tight">
            {CATEGORY_MAP[categorySlug].name}
          </h1>
          {/* <p className="text-muted-foreground mt-3 font-medium">
            <span className="text-accent-primary font-bold">
              {data.posts.length}개
            </span>
            의 기록이 있습니다.
          </p> */}
        </div>
        <Link
          href={PAGE_PATH.write}
          className={getButtonStyles("primary", "md", "font-bold")}
        >
          <Plus size={24} />
        </Link>
      </header>

      {isPending ? (
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <PostList categorySlug={categorySlug} postItems={data.posts} />

          {/* 페이지네이션: 데이터가 있을 때만 렌더링 */}
          {data.totalPages === 1 && (
            <PostListPagination
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PostListContainer;
