"use client";

import dynamic from "next/dynamic";
import { useState, useDeferredValue, useCallback } from "react";
import { Divider } from "@/components/common";
import { CategorySlug, EditorMode, PostForm } from "@/types/blog";
import { ContentEditor, TitleInput } from ".";
import { useScrollSync } from "@/hooks/useScrollSync";
import useSavePost from "@/queries/useSavePost";
import { EditorToolbar } from "@/app/(editor)/edit/components";
import useSaveDraft from "@/queries/useSaveDraft";
import { CATEGORY_MAP } from "@/constants/blog";

type EditorFormProps = {
  mode: EditorMode;
  initialData: PostForm;
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

const EditorForm = ({ mode, initialData }: EditorFormProps) => {
  const [formData, setFormData] = useState<PostForm>(initialData);

  const { editorRef, previewRef, handleScroll, handleMouseEnter } =
    useScrollSync();
  const { mutate: onSave, isPending: isSavePending } = useSavePost();
  const { mutate: onDraftSave, isPending: isSaveDraftPending } = useSaveDraft();

  const isPending = isSavePending || isSaveDraftPending;

  const handleSave = () => {
    if (isSavePending) return;

    onSave(formData);
  };

  const handleSaveDraft = () => {
    if (isSaveDraftPending) return;

    onDraftSave(formData);
  };

  // 미리보기 성능 최적화 (본문 렌더링을 0.x초 뒤로 미룸)
  const deferredContent = useDeferredValue(formData.content);

  const handleToggleIsPrivate = () => {
    setFormData((prev) => ({
      ...prev,
      isPrivate: !prev.isPrivate,
    }));
  };

  const handleSelectCategory = (slug: CategorySlug) => {
    setFormData((prev) => ({
      ...prev,
      categorySlug: slug,
      isPrivate: CATEGORY_MAP[slug].isPrivate,
    }));
  };

  const handleUpdateField = useCallback(
    <K extends keyof PostForm>(field: K, value: PostForm[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  return (
    <div className="p-2 flex flex-col h-full gap-2">
      <EditorToolbar
        mode={mode}
        categorySlug={formData.categorySlug}
        isPrivate={formData.isPrivate}
        isPending={isPending}
        onTogglePrivate={handleToggleIsPrivate}
        onSave={handleSave}
        onDraftSave={handleSaveDraft}
        onSelect={handleSelectCategory}
      />

      <TitleInput
        value={formData.title}
        onChange={(val) => handleUpdateField("title", val)}
      />

      <div className="flex-1 flex min-h-0 gap-6">
        <section
          onMouseEnter={() => handleMouseEnter("editor")}
          className={`flex-1 flex flex-col pb-[${EDITOR_LAYOUT.bottomPadding}vh]`}
        >
          <ContentEditor
            value={formData.content}
            onChange={(val) => handleUpdateField("content", val)}
            onScroll={() => handleScroll("editor")}
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
          onMouseEnter={() => handleMouseEnter("preview")}
          className={`flex-1 overflow-y-auto border-red-400 bg-background/50 pb-[${EDITOR_LAYOUT.bottomPadding}vh]`}
        >
          <MarkdownPreview
            content={deferredContent}
            className="mb-6  border-red-400"
          />
        </section>
      </div>
    </div>
  );
};

export default EditorForm;
