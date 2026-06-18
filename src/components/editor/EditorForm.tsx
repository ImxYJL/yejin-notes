'use client';

import { useState, useDeferredValue, useCallback } from 'react';
import { Divider } from '@/components/common';
import { Category, CategorySlug, EditorMode, PostForm } from '@/types/blog';
import { ContentEditor, TitleInput } from '.';
import { useScrollSync } from '@/hooks/useScrollSync';
import useSavePost from '@/queries/useSavePost';
import { EditorToolbar } from '@/app/(admin)/admin/edit/components';
import { useQueryClient } from '@tanstack/react-query';
import { getEditorPostApi } from '@/apis/posts';
import usePostImage from '@/hooks/usePostImage';
import { MarkdownPreview } from '../markdown';
import { convertToPostForm } from '@/utils/posts';
import { buildCategoryMap } from '@/utils/posts/category';
import useSaveDraft from '@/queries/useSaveDraft';
import useAutoSave from '@/hooks/useAutoSave';
import { PAGE_PATH } from '@/constants/paths';

type EditorFormProps = {
  mode: EditorMode;
  initialData: PostForm;
  categories: Category[];
};

export const EDITOR_LAYOUT = {
  bottomPadding: 4,
} as const;

const EditorForm = ({ mode, categories, initialData }: EditorFormProps) => {
  const [formData, setFormData] = useState<PostForm>(initialData);

  const setPostId = (id: string) => {
    setFormData((prev) => ({ ...prev, id }));
  };

  // 미리보기 성능 최적화 (본문 렌더링을 0.x초 뒤로 미룸)
  const deferredContent = useDeferredValue(formData.content);

  const categoryMap = buildCategoryMap(categories);
  const { editorRef, previewRef, handleScroll, handleMouseEnter } = useScrollSync();

  const queryClient = useQueryClient();
  const { mutate: onSave, isPending: isSavePending } = useSavePost();
  const { mutate: onDraftSave, isPending: isSaveDraftPending } =
    useSaveDraft(setPostId);
  const { trigger: autoSave, cancel: cancelAutoSave } = useAutoSave(
    formData,
    setPostId,
  );

  const isPending = isSavePending || isSaveDraftPending;

  const handleUpdateField = <K extends keyof PostForm>(
    field: K,
    value: PostForm[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    autoSave(field, value);
  };

  const { insertImage, autoThumbnail } = usePostImage({
    content: formData.content,
    onUpdateField: handleUpdateField,
    editorRef,
  });

  const handleImgPaste = (file: File) => {
    insertImage(file);
  };

  const handleSave = () => {
    if (isSavePending) return;

    onSave({
      ...formData,
      thumbnailUrl: autoThumbnail,
      summary: extractSummary(formData.content),
    });
  };

  const handleSaveDraft = () => {
    if (isSaveDraftPending) return;

    onDraftSave(formData);
  };

  const handleSelectDraft = async (id: string) => {
    cancelAutoSave();
    const data = await getEditorPostApi(id);
    setFormData(convertToPostForm(data));
    window.history.replaceState(null, '', PAGE_PATH.admin.edit(id));
  };

  const handleToggleIsPrivate = () => {
    setFormData((prev) => ({
      ...prev,
      isPrivate: !prev.isPrivate,
    }));
  };

  const handleSelectCategory = (slug: CategorySlug) => {
    const targetCategory = categoryMap?.[slug];
    if (!targetCategory) return;

    setFormData((prev) => ({
      ...prev,
      categorySlug: slug,
      isPrivate: categoryMap[slug].isPrivate,
    }));
  };

  const handleContentChange = (val: string) => {
    handleUpdateField('content', val);
  };

  const handleTitleChange = (val: string) => {
    handleUpdateField('title', val);
  };

  const handleEditorScroll = useCallback(() => {
    handleScroll('editor');
  }, [handleScroll]);

  return (
    <div className="flex flex-col h-full gap-2 p-2">
      <EditorToolbar
        mode={mode}
        categorySlug={formData.categorySlug}
        categoryMap={categoryMap}
        isPrivate={formData.isPrivate}
        isPending={isPending}
        onTogglePrivate={handleToggleIsPrivate}
        onSave={handleSave}
        onDraftSave={handleSaveDraft}
        onCategorySelect={handleSelectCategory}
        onDraftSelect={handleSelectDraft}
      />

      <TitleInput value={formData.title} onChange={handleTitleChange} />

      <div className="flex flex-1 min-h-0 gap-6">
        <section
          onMouseEnter={() => handleMouseEnter('editor')}
          className={`flex-1 flex flex-col pb-[${EDITOR_LAYOUT.bottomPadding}vh]`}
        >
          <ContentEditor
            value={formData.content}
            onChange={handleContentChange}
            onScroll={handleEditorScroll}
            onImgPaste={handleImgPaste}
            ref={editorRef}
          />
        </section>

        <Divider
          direction="vertical"
          style={{ height: `calc(100% - ${EDITOR_LAYOUT.bottomPadding}vh)` }}
        />

        <section
          ref={previewRef}
          onMouseEnter={() => handleMouseEnter('preview')}
          className={`flex-1 overflow-y-auto border-red-400 bg-background/50 pb-[${EDITOR_LAYOUT.bottomPadding}vh]`}
        >
          <MarkdownPreview
            content={deferredContent}
            className="mb-6 border-red-400"
          />
        </section>
      </div>
    </div>
  );
};

export const extractSummary = (content: string, length = 150): string => {
  if (!content) return '';

  return (
    content
      // 1. 마크다운 특수문자 제거
      .replace(/[#*`>_~]/g, '')
      .replace(/[!image]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // [링크텍스트](URL) 에서 링크텍스트만 남김

      // 2. 공백 및 줄바꿈 정리
      .replace(/\s+/g, ' ') // 모든 연속된 공백과 줄바꿈을 한 칸의 공백으로 변경

      // 3. 길이 조절 및 정리
      .slice(0, length)
      .trim()
  );
};

export default EditorForm;
