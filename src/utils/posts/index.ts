import { Post, PostForm } from '@/types/blog';

/**
 * 서버 응답 데이터를 폼 전용 타입으로 변환해주는 매퍼
 */
export const convertToPostForm = (data: Post): PostForm => {
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    summary: data.summary,
    categorySlug: data.category.slug,
    tags: data.tags,
    thumbnailUrl: data.thumbnailUrl,
    isPrivate: data.isPrivate,
    isPublished: data.isPublished,
  };
};
