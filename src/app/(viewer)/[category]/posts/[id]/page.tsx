"use client";

import { PostNavigationList } from "@/app/(viewer)/components";
import Button from "@/components/common/Button";
import { Edit2, Lock, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { use } from "react";

type PostParams = {
  category: string;
  id: string;
};

const PostDetailPage = ({ params }: { params: Promise<PostParams> }) => {
  const { category, id } = use(params);
  const isAdmin = true; // 실제로는 유저 세션 확인

  return (
    <div className="space-y-16">
      {/* Article Content */}
      <article>
        <header className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight max-w-[80%]">
              UUID 기반의 명시적 리소스 관리 전략
            </h1>

            <div className="flex flex-col gap-2 items-end">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground shrink-0 pb-1">
                <Clock size={20} /> 2026.02.08
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center flex-wrap gap-4 text-sm text-muted-foreground">
            {/* 왼쪽: 카테고리 태그 */}
            <span className="flex items-center gap-1.5">
              <Tag size={20} /> {category.toUpperCase()}
            </span>

            {/* 오른쪽 그룹: Edit 버튼 + 자물쇠 아이콘 */}
            <div className="flex items-center">
              <span className="text-palette-0 font-bold bg-palette-0/10 px-2 py-0.5 rounded flex items-center justify-center">
                <Lock size={20} />
              </span>
              {isAdmin && (
                <Link href={`/edit/${id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit2 size={20} />}
                    className="p-0"
                  />
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="markdown-body min-h-[400px]">
          {/* 실제 데이터 렌더링 */}
          <p>마크다운 본문이 출력되는 영역입니다.</p>
        </div>
      </article>

      {/* Bottom List (네이버 블로그 스타일) */}
      <PostNavigationList
        category={category}
        currentPostId={id}
        posts={[
          {
            id: "1234",
            title: "모킹 데이터",
            createdAt: "2025-04-30",
          },
          {
            id: "12345",
            title: "안녕",
            createdAt: "2025-04-30",
          },
          {
            id: "12341",
            title: "긴 제목을 달 수 있을지 궁금해",
            createdAt: "2025-04-30",
          },
        ]}
      />
    </div>
  );
};

export default PostDetailPage;
