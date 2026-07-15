'use client';

import { useState, useDeferredValue, useCallback } from 'react';
import { Divider } from '@/components/common';
import { Category, CategorySlug, EditorMode, PostForm } from '@/types/blog';
import { ContentEditor, TitleInput } from '.';
import { useScrollSync } from '@/hooks/useScrollSync';
import useSavePost from '@/queries/useSavePost';
import { EditorToolbar } from '@/app/(admin)/admin/edit/components';
import { getEditorPostApi } from '@/apis/posts';
import usePostImage from '@/hooks/usePostImage';
import { MarkdownPreview } from '../markdown';
import { convertToPostForm, mergeFormData } from '@/utils/posts';
import { buildCategoryMap } from '@/utils/posts/category';
import useSaveDraft from '@/queries/useSaveDraft';
import useAutoSave from '@/hooks/useAutoSave';
import { PAGE_PATH } from '@/constants/paths';
import { useToastStore } from '@/store/useToastStore';
import { extractSummary } from '@/utils/markdowns/regex';

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

  const { showToast } = useToastStore();
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
    const partial = { [field]: value };

    // NOTE: merge base가 updater는 prev, trigger(autoSave)는 이번 렌더의 formData로 다름
    // 같은 핸들러 안에서 autoSave를 두 번 부르면 앞의 변경이 유실될 수 있음 → 변경분을 하나의 partial로 묶어 호출할 것
    setFormData((prev) => mergeFormData(prev, partial));
    autoSave(partial);
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

    const data = await getEditorPostApi(id).catch(() => {
      showToast('초안을 불러오지 못했습니다.', 'error');
      return null;
    });
    if (!data) return;

    setFormData(convertToPostForm(data));
    window.history.replaceState(null, '', PAGE_PATH.admin.edit(id));
  };

  const handleToggleIsPrivate = () => {
    const partial = { isPrivate: !formData.isPrivate };
    setFormData((prev) => mergeFormData(prev, partial));
    autoSave(partial);
  };

  const handleSelectCategory = (slug: CategorySlug) => {
    const targetCategory = categoryMap?.[slug];
    if (!targetCategory) return;

    const partial = { categorySlug: slug, isPrivate: targetCategory.isPrivate };
    setFormData((prev) => mergeFormData(prev, partial));
    autoSave(partial);
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

export default EditorForm;
