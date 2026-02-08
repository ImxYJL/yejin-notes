"use client";

import Button from "@/components/common/Button";
import Link from "next/link";
import { use } from "react";

type ListParams = {
  category: string;
};

const PostListPage = ({ params }: { params: Promise<ListParams> }) => {
  const { category } = use(params);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-3xl font-black capitalize">{category}</h1>
          <p className="text-muted-foreground mt-2">
            총 12개의 기록이 있습니다.
          </p>
        </div>
        <Link href="/write">
          <Button variant="primary" size="sm">
            New Post
          </Button>
        </Link>
      </header>

      <div className="divide-y divide-gray-100">
        {[1, 2, 3, 4, 5].map((i) => (
          <Link
            key={i}
            href={`/${category}/posts/uuid-${i}`}
            className="block py-8 group"
          >
            <div className="space-y-3">
              <h2 className="text-2xl font-bold group-hover:text-palette-5 transition-colors">
                글 제목 {i}
              </h2>
              <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                이것은 요약 텍스트(summary)입니다. DB의 summary 컬럼에서 가져온
                데이터를 프론트에서 2줄 정도로 잘라서 보여줍니다...
              </p>
              <span className="text-sm text-gray-400">2026.02.08</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pt-10">
        <Button variant="outline" size="sm" disabled>
          Prev
        </Button>
        <span className="text-sm font-mono font-bold">1 / 3</span>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </div>
  );
};

export default PostListPage;
