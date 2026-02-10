"use client";

import { useMemo } from "react";
import EditorForm from "@/components/editor/EditorForm";
import { PostFormData } from "@/types/blog";
import { DEFAULT_POST_FORM } from "@/constants/blog";

const WritePage = () => {
  // 컴포넌트가 리렌더링되어도 ID가 바뀌지 않도록 useMemo 사용
  const initialData = useMemo<PostFormData>(
    () => ({
      ...DEFAULT_POST_FORM,
      id: crypto.randomUUID(), // ID만 새로 생성해서 덮어쓰기
    }),
    [],
  );

  return <EditorForm initialData={initialData} mode="create" />;
};

export default WritePage;
