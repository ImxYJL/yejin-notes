"use client";

import { PostNavigationList } from "@/app/(viewer)/components";
import { Divider } from "@/components/common";
import Button from "@/components/common/Button";
import { Edit2, Lock, Clock, Tag } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { use } from "react";

type PostParams = {
  category: string;
  id: string;
};

const MarkdownViewer = dynamic(
  () => import("@/components/markdown/MarkdownViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-muted-foreground font-mono">
        미리보기 준비 중...
      </div>
    ),
  },
);

const PostDetailPage = ({ params }: { params: Promise<PostParams> }) => {
  const { category, id } = use(params);
  const isAdmin = true; // 실제로는 유저 세션 확인

  const mockContent = `
# 마크다운 하이라이팅 테스트

이 글은 **Shiki**와 **highlight.js**의 성능 차이를 확인하기 위한 테스트용 글입니다.

## 1. TypeScript & React
제네릭과 복합 타입을 얼마나 잘 쪼개는지 확인해 보세요.

\`\`\`typescript
type UserRole = 'admin' | 'editor';

interface User<T extends UserRole> {
  id: string;
  role: T;
  // 조건부 타입 테스트
  permissions: T extends 'admin' ? string[] : null;
}

const checkAccess = <T extends UserRole>(user: User<T>): boolean => {
  return user.role === 'admin';
};
\`\`\`

## 2. SQL 테스트
백엔드 연동 시 사용할 쿼리문입니다.

\`\`\`sql
SELECT p.title, t.name 
FROM posts p
JOIN tags t ON p.id = t.post_id
WHERE p.status = 'published'
ORDER BY p.created_at DESC;
\`\`\`

> 이 문구는 인용문(Blockquote) 스타일 테스트입니다.
`;

  return (
    <div className="space-y-16">
      {/* Article Content */}
      <article>
        <header className="mb-4 space-y-2">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
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

        <Divider direction="horizontal" className="opacity-80 mb-12" />

        <section className="bg-background rounded-main">
          <MarkdownViewer content={mockContent} />
        </section>
      </article>

      <Divider direction="horizontal" className="opacity-80" />

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
