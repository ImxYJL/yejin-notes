"use client";

import Button from "@/components/common/Button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { PAGE_PATH } from "@/constants/paths";
import { CategorySlug } from "@/types/blog";
import { CATEGORY_MAP } from "@/constants/blog";
import usePosts from "@/queries/usePosts";
import { PostListPagination } from "../../components";

type ListParams = {
  categorySlug: CategorySlug;
};

const PostListPage = ({ params }: { params: Promise<ListParams> }) => {
  const [page, setPage] = useState(1);

  const { categorySlug } = use(params);
  const { data } = usePosts(categorySlug, page);

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
          <p className="text-muted-foreground mt-3 font-medium">
            총
            <span className="text-accent-primary font-bold">
              {data.posts.length}개
            </span>
            의 기록이 있습니다.
          </p>
        </div>
        <Link href="/write">
          <Button variant="primary" size="md" className="font-bold">
            <Plus size={24} />
          </Button>
        </Link>
      </header>

      {/* Post List */}
      <div className="divide-y divide-border">
        {data.posts.map((post) => (
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

      {data.totalPages > 1 && (
        <PostListPagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default PostListPage;
