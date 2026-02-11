"use client";

import { useState, useDeferredValue, useCallback } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Divider } from "@/components/common";
import { EditorMode, PostFormData } from "@/types/blog";
import { ContentEditor, TitleInput } from ".";
import dynamic from "next/dynamic";
import { useScrollSync } from "@/hooks/useScrollSync";

type EditorFormProps = {
  mode: EditorMode;
  initialData?: PostFormData;
};

export const EDITOR_LAYOUT = {
  bottomPadding: 4,
} as const;

const MarkdownPreview = dynamic(
  () => import("@/components/markdown/MarkdownPreview"),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-muted-foreground font-mono">
        미리보기 준비 중...
      </div>
    ),
  },
);

const EditorForm = ({ mode, initialData = {} }: EditorFormProps) => {
  const [formData, setFormData] = useState<PostFormData>(initialData);
  const router = useRouter();
  const { editorRef, previewRef, handleScroll } = useScrollSync();

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
    <div className="flex flex-col h-full gap-4">
      {/* 툴바 */}
      <header className="flex justify-between items-center pr-6 pt-6 pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          icon={<ArrowLeft size={16} />}
          className="hover:bg-accent-primary/10"
        >
          나가기
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
            Draft
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

      <div className="px-2 flex flex-col gap-2">
        <TitleInput
          value={formData.title}
          onChange={(val) => handleUpdateField("title", val)}
        />
      </div>

      <div className="flex-1 flex min-h-0 gap-6 mt-4">
        <section
          className={`flex-1 flex flex-col pb-[${EDITOR_LAYOUT.bottomPadding}vh]`}
        >
          {/* 본문 에디터 */}
          <ContentEditor
            value={formData.content}
            onChange={(val) => handleUpdateField("content", val)}
            onScroll={handleScroll}
            ref={editorRef}
          />
        </section>

        <Divider
          direction="vertical"
          style={{ height: `calc(100% - ${EDITOR_LAYOUT.bottomPadding}vh)` }}
        />
        {/* 미리보기 */}
        <section
          ref={previewRef}
          className={`flex-1 overflow-y-auto border-border pl-10 bg-background/50 pb-[${EDITOR_LAYOUT}vh]`}
        >
          <MarkdownPreview content={deferredContent} />
        </section>
      </div>
    </div>
  );
};

export default EditorForm;
