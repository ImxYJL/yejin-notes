export type Category = {
  id: string; // 'dev', 'reading', 'life'
  name: string; // '개발', '독서', '일상'
  isPrivate: boolean;
};
export type CategoryType = "dev" | "reading" | "life";

export type EditorMode = "create" | "edit";

/**
 * Post 관련 타입들
 */

type PostBase = {
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  tags: string[];
  isPublished: boolean;
  isPrivate: boolean;
  thumbnailUrl: string | null;
};

export type CreatePostInput = PostBase;
export type UpdatePostInput = Partial<PostBase>;

export type PostForm = PostBase & {
  id?: string;
};
export type PostDetail = PostBase & {
  id: string;
  createdAt: string;
};

/**
 * 포스트 목록에서 보여주는 미리보기용 타입
 */
export type PostItem = Omit<PostDetail, "content">;
