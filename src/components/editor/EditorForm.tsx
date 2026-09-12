'use client';

import { useState, useDeferredValue, useCallback, useRef, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { Category, CategorySlug, EditorMode, PostForm } from '@/types/blog';
import { ContentEditor, TitleInput } from '.';
import useSavePost from '@/queries/useSavePost';
import { EditorToolbar, CategorySelector } from '@/app/(admin)/admin/edit/components';
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
import { cn } from '@/utils/styles';

type EditorFormProps = {
  mode: EditorMode;
  initialData: PostForm;
  categories: Category[];
};

const EditorForm = ({ mode, categories, initialData }: EditorFormProps) => {
  const [formData, setFormData] = useState<PostForm>(initialData);
  const [showPreview, setShowPreview] = useState(false);

  const setPostId = (id: string) => {
    setFormData((prev) => ({ ...prev, id }));
  };

  const deferredContent = useDeferredValue(formData.content);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    });
  }, [showPreview]);

  const categoryMap = buildCategoryMap(categories);

  const { showToast } = useToastStore();
  const { mutate: onSave, isPending: isSavePending } = useSavePost();
  const { mutate: onDraftSave, isPending: isSaveDraftPending } = useSaveDraft(setPostId);
  const { trigger: autoSave, cancel: cancelAutoSave } = useAutoSave(formData, setPostId);

  const isPending = isSavePending || isSaveDraftPending;

  const handleUpdateField = <K extends keyof PostForm>(field: K, value: PostForm[K]) => {
    const partial = { [field]: value };
    setFormData((prev) => mergeFormData(prev, partial));
    autoSave(partial);
  };

  const { insertImage, autoThumbnail } = usePostImage({
    content: formData.content,
    onUpdateField: handleUpdateField,
    editorRef,
  });

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

  const handleContentChange = useCallback((val: string) => {
    handleUpdateField('content', val);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar
        isPending={isPending}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview((p) => !p)}
        onSave={handleSave}
        onDraftSave={handleSaveDraft}
        onDraftSelect={handleSelectDraft}
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto max-w-(--editor-max-w) px-8 pb-40">

          {/* 메타 행 — 제목과 함께 스크롤됨 */}
          <div className="flex items-center gap-2 pt-8 pb-5">
            <button
              type="button"
              onClick={handleToggleIsPrivate}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] base-transition',
                formData.isPrivate
                  ? 'border-accent-primary/50 text-accent-primary'
                  : 'border-muted-foreground/25 text-muted-foreground hover:border-accent-primary/40 hover:text-accent-primary/80',
              )}
            >
              {formData.isPrivate ? <Lock size={11} /> : <Unlock size={11} />}
              {formData.isPrivate ? '비공개' : '공개'}
            </button>

            <CategorySelector
              categorySlug={formData.categorySlug}
              categoryMap={categoryMap}
              onSelect={handleSelectCategory}
            />
          </div>

          <TitleInput value={formData.title} onChange={(val) => handleUpdateField('title', val)} />

          {/* 콘텐츠 영역 */}
          <div className="flex gap-8 items-start">
            <section className={cn('min-w-0', showPreview ? 'flex-1' : 'w-full')}>
              <ContentEditor
                value={formData.content}
                onChange={handleContentChange}
                onImgPaste={(file) => insertImage(file)}
                ref={editorRef}
              />
            </section>

            {showPreview && (
              <>
                <section className="flex-1 min-w-0 pt-1">
                  <MarkdownPreview content={deferredContent} />
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorForm;
