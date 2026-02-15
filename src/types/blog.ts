import { CATEGORY_MAP } from "@/constants/blog";

export type CategorySlug = keyof typeof CATEGORY_MAP;
export type Category = {
  id: string;
  slug: CategorySlug;
  name: string; // '개발' | '독서' | '일상'
  isPrivate: boolean;
};

export type EditorMode = "create" | "edit";

/**
 * Post 관련 타입들
 */

/**
 * DB의 Post table row
 */
export type PostRow = {
  id: string;
  title: string;
  content: string;
  summary: string;
  category_id: string;
  tags: string[] | null;
  is_private: boolean;
  is_published: boolean;
  thumbnail_url: string | null;
  created_at: string;
  category: {
    slug: string;
    name: string;
  };
};

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
  category: {
    slug: CategorySlug;
    name: string;
  };
};

/**
 * 포스트 목록에서 보여주는 미리보기용 타입
 */
export type PostItem = Omit<PostDetail, "content">;
