"use client";

import { useState, useDeferredValue, useCallback } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../common";
// import MarkdownRenderer from "../markdown/MarkdownRenderer";
import { EditorMode, PostFormData } from "@/types/blog";
import { ContentEditor, TitleInput } from ".";
import dynamic from "next/dynamic";

type EditorFormProps = {
  mode: EditorMode;
  initialData?: PostFormData; // 낱개가 아닌 덩어리로 전달
};

const MarkdownRenderer = dynamic(() => import("../markdown/MarkdownRenderer"), {
  ssr: false,
  loading: () => (
    <div className="p-4 text-muted-foreground font-mono">
      미리보기 준비 중...
    </div>
  ),
});

const EditorForm = ({ mode, initialData = {} }: EditorFormProps) => {
  const router = useRouter();

  const [formData, setFormData] = useState<PostFormData>(initialData);

  // 미리보기 성능 최적화 (본문 렌더링을 0.x초 뒤로 미룸)
  const deferredContent = useDeferredValue(formData.content);

  const handleUpdateField = useCallback(
    <K extends keyof PostFormData>(field: K, value: PostFormData[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleSave = async () => {
    alert("저장되었습니다!");
    router.push(`/${formData.categoryId}/posts/${formData.id}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] gap-8">
      {/* 툴바 */}
      <header className="flex justify-between items-center px-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          icon={<ArrowLeft size={16} />}
        >
          나가기
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
            나중에 임시저장 만들기
          </span>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            icon={<Save size={16} />}
            className="font-bold"
          >
            {mode === "create" ? "게시하기" : "수정완료"}
          </Button>
        </div>
      </header>

      <TitleInput
        value={formData.title}
        onChange={(val) => handleUpdateField("title", val)}
      />

      <div className="flex-1 flex min-h-0 gap-10">
        <section className="flex-1 flex flex-col">
          {/* 본문 에디터 */}
          <ContentEditor
            value={formData.content}
            onChange={(val) => handleUpdateField("content", val)}
          />
        </section>

        {/* 미리보기 (DeferredValue로 타이핑 랙 방지) */}
        <section className="flex-1 overflow-y-auto border-l border-border pl-10 bg-background/50">
          <MarkdownRenderer content={deferredContent} isEditor={true} />
        </section>
      </div>
    </div>
  );
};

export default EditorForm;
