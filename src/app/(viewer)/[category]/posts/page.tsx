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
    <div className="space-y-12">
      <header className="flex justify-between items-end border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black capitalize tracking-tight">
            {category}
          </h1>
          <p className="text-muted-foreground mt-3 font-medium">
            총 <span className="text-accent-primary font-bold">12개</span>의
            기록이 있습니다.
          </p>
        </div>
        <Link href="/write">
          <Button variant="primary" size="md" className="font-bold">
            New Post
          </Button>
        </Link>
      </header>

      {/* Post List */}
      <div className="divide-y divide-border">
        {[1, 2, 3, 4, 5].map((i) => (
          <Link
            key={i}
            href={`/${category}/posts/uuid-${i}`}
            className="block py-10 group"
          >
            <article className="space-y-4">
              <h2 className="text-2xl font-bold group-hover:text-accent-primary base-transition tracking-tight">
                글 제목 {i}
              </h2>
              <p className="text-muted-foreground line-clamp-2 leading-relaxed text-base">
                이것은 요약 텍스트(summary)입니다. DB의 summary 컬럼에서 가져온
                데이터를 프론트에서 2줄 정도로 잘라서 보여줍니다. v4의 텍스트
                밸런싱을 적용하면 더 예뻐집니다.
              </p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground/60 font-mono">
                <span>2026.02.08</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>5 min read</span>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Pagination: 공통 버튼 활용 */}
      <nav
        className="flex justify-center items-center gap-6 pt-12"
        aria-label="Pagination"
      >
        <Button variant="outline" size="sm" disabled className="w-24">
          Prev
        </Button>
        <span className="text-sm font-bold font-mono tracking-widest">
          <span className="text-accent-primary">1</span> / 3
        </span>
        <Button variant="outline" size="sm" className="w-24">
          Next
        </Button>
      </nav>
    </div>
  );
};

export default PostListPage;
