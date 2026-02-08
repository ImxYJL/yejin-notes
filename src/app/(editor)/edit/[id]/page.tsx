"use client";

import { use } from "react";
import EditorForm from "@/components/editor/EditorForm";

export type Post = {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: "reading" | "dev";
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

// src/mocks/postData.ts
export const MOCK_POST: Post = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Next.js 15와 Tailwind v4로 구축하는 현대적인 블로그",
  content: `
# 시작하며
이 블로그는 **프리텐다드** 폰트와 **Rainbow 테마**를 사용하여 제작되었습니다.

## 주요 특징
1. **UUID** 기반의 리소스 관리
2. **Zustand**를 활용한 레이아웃 상태 관리
3. **Tailwind v4**의 강력한 테마 시스템

> 인용구 테스트: 지식은 나눌수록 커집니다.

\`\`\`typescript
const greeting = "Hello, Gemini!";
console.log(greeting);
\`\`\`
  `,
  summary:
    "Next.js 15의 최신 스펙을 활용하여 블로그를 구축하는 과정을 담았습니다.",
  category: "dev",
  isPublished: true,
  createdAt: "2026-02-08T15:00:00Z",
  updatedAt: "2026-02-08T15:00:00Z",
};

const EditPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  // 실제로는 여기서 TanStack Query로 데이터를 가져옵니다.
  // const { data: post } = useQuery({ queryKey: ['post', id], ... });
  const post = MOCK_POST;

  return (
    <div className="py-10">
      <EditorForm
        postId={id}
        mode="edit"
        initialData={{
          title: post.title,
          content: post.content,
          category: post.category,
          isPublished: post.isPublished,
        }}
      />
    </div>
  );
};

export default EditPage;
