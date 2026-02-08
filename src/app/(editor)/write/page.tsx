"use client";

import { useMemo } from "react";
import EditorForm from "@/components/editor/EditorForm";

// TODO: split viewer
const WritePage = () => {
  // 컴포넌트가 리렌더링되어도 ID가 바뀌지 않도록 useMemo 사용
  const newPostId = useMemo(() => crypto.randomUUID(), []);

  return (
    <div className="py-10">
      <EditorForm postId={newPostId} mode="create" />
    </div>
  );
};

export default WritePage;
