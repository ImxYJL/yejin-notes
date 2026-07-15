import { Post, PostForm } from '@/types/blog';

/**
 * 서버 응답 데이터를 폼 전용 타입으로 변환해주는 매퍼
 */
export const convertToPostForm = (data: Post): PostForm => ({
  id: data.id,
  title: data.title,
  content: data.content,
  summary: data.summary,
  categorySlug: data.category.slug,
  tags: data.tags,
  thumbnailUrl: data.thumbnailUrl,
  isPrivate: data.isPrivate,
  isPublished: data.isPublished,
});

/**
 * 에디터 폼 상태에 변경분(partial) 병합
 * setState updater와 자동저장 trigger가 반드시 이 함수를 공유해야 함 —
 * 병합 로직이 두 곳에서 따로 정의되는 문제 방지
 */
export const mergeFormData = (
  base: PostForm,
  partial: Partial<PostForm>,
): PostForm => ({
  ...base,
  ...partial,
});
