'use client';

import dynamic from 'next/dynamic';
import { useState, useDeferredValue, useCallback } from 'react';
import { Divider } from '@/components/common';
import {
  CategorySlug,
  EditorMode,
  PostDetailResponse,
  PostForm,
} from '@/types/blog';
import { ContentEditor, TitleInput } from '.';
import { useScrollSync } from '@/hooks/useScrollSync';
import useSavePost from '@/queries/useSavePost';
import { EditorToolbar } from '@/app/(editor)/edit/components';
import useSaveDraft from '@/queries/useSaveDraft';
import { useQueryClient } from '@tanstack/react-query';
import { getPostApi } from '@/apis/posts';
import { BLOG_QUERY_KEY } from '@/queries/queryKey';
import useCurrentCategory from '@/hooks/useCurrentCategory';
import usePostImage from '@/hooks/usePostImage';

type EditorFormProps = {
  mode: EditorMode;
  initialData: PostForm;
};

export const EDITOR_LAYOUT = {
  bottomPadding: 4,
} as const;

const MarkdownPreview = dynamic(
  () => import('@/components/markdown/MarkdownPreview'),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-muted-foreground font-mono">미리보기 준비 중...</div>
    ),
  },
);

const EditorForm = ({ mode, initialData }: EditorFormProps) => {
  const [formData, setFormData] = useState<PostForm>(initialData);

  const handleUpdateField = useCallback(
    <K extends keyof PostForm>(field: K, value: PostForm[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const { editorRef, previewRef, handleScroll, handleMouseEnter } = useScrollSync();

  const queryClient = useQueryClient();
  const { mutate: onSave, isPending: isSavePending } = useSavePost();
  const { mutate: onDraftSave, isPending: isSaveDraftPending } = useSaveDraft();
  const { insertImage } = usePostImage({
    content: formData.content,
    onUpdateField: handleUpdateField,
    editorRef,
  });

  const handleImgPaste = useCallback(
    (file: File) => {
      insertImage(file);
    },
    [insertImage],
  ); // 폼 데이터 의존성 주의
  const { categoryMap } = useCurrentCategory();

  const isPending = isSavePending || isSaveDraftPending;
  // 미리보기 성능 최적화 (본문 렌더링을 0.x초 뒤로 미룸)
  const deferredContent = useDeferredValue(formData.content);

  const handleSave = () => {
    if (isSavePending) return;

    onSave({
      ...formData,
      summary: extractSummary(formData.content),
    });
  };

  const handleSaveDraft = () => {
    if (isSaveDraftPending) return;

    onDraftSave(formData);
  };

  const handleSelectDraft = async (id: string) => {
    const data = await queryClient.fetchQuery({
      queryKey: [BLOG_QUERY_KEY.post, id],
      queryFn: () => getPostApi(id),
    });

    setFormData(convertToPostForm(data));
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

  const handleContentChange = useCallback(
    (val: string) => {
      handleUpdateField('content', val);
    },
    [handleUpdateField],
  );

  const handleTitleChange = useCallback(
    (val: string) => {
      handleUpdateField('title', val);
    },
    [handleUpdateField],
  );

  const handleEditorScroll = useCallback(() => {
    handleScroll('editor');
  }, [handleScroll]);

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
        onCategorySelect={handleSelectCategory}
        onDraftSelect={handleSelectDraft}
      />

      <TitleInput value={formData.title} onChange={handleTitleChange} />

      <div className="flex-1 flex min-h-0 gap-6">
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
            className="mb-6  border-red-400"
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
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // [링크텍스트](URL) 에서 링크텍스트만 남김

      // 2. 공백 및 줄바꿈 정리
      .replace(/\s+/g, ' ') // 모든 연속된 공백과 줄바꿈을 한 칸의 공백으로 변경

      // 3. 길이 조절 및 정리
      .slice(0, length)
      .trim()
  );
};

// TODO: dev 상수화
export const convertToPostForm = (data: PostDetailResponse): PostForm => {
  return {
    id: data.id,
    title: data.title ?? '',
    content: data.content ?? '',
    summary: data.content ?? '',
    tags: data.tags,
    thumbnailUrl: data.thumbnailUrl,
    categorySlug: data.category?.slug ?? 'dev',
    isPrivate: data.isPrivate,
    isPublished: data.isPublished,
  };
};

export default EditorForm;
