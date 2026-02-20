import { CATEGORY_MAP } from "@/constants/blog";
import { PaginationMeta } from "./page";

/** -----------------------------------------------------------
 * 1. Category 관련 (공통)
 * ----------------------------------------------------------- */
export type CategorySlug = keyof typeof CATEGORY_MAP;

export type Category = {
  id: string;
  slug: CategorySlug;
  name: string;
  isPrivate: boolean;
};

/** -----------------------------------------------------------
 * 2. Post 관련 (Domain Entity)
 * ----------------------------------------------------------- */

export type Post = {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: {
    slug: CategorySlug;
    name: string;
  };
  tags: string[];
  thumbnailUrl: string | null;
  isPrivate: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

/** -----------------------------------------------------------
 * 3. DB Raw Data (Supabase에서 넘어오는 원본)
 * ----------------------------------------------------------- */
export type PostRow = {
  id: string;
  title: string;
  content: string;
  summary: string;
  category_id: string; // FK
  tags: string[] | null;
  is_private: boolean;
  is_published: boolean;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string; // DB에서 알아서 생성해줌
  category: {
    // TODO: 프론트에서도 이대로 쓸 것인가?
    slug: string;
    name: string;
  };
};

/** -----------------------------------------------------------
 * 4. DTO & Form (생성, 수정, 입력)
 * ----------------------------------------------------------- */

export type PostForm = Omit<Post, "createdAt" | "category"> & {
  categorySlug: CategorySlug;
};

export type EditorMode = "create" | "edit";

/** -----------------------------------------------------------
 * 5. Response & Navigation (API 응답)
 * ----------------------------------------------------------- */

// 목록용 미리보기
export type PostItem = Omit<Post, "content" | "updatedAt" | "category">;

export type PostNavigation = {
  prevPost: Pick<Post, "id" | "title"> | null;
  nextPost: Pick<Post, "id" | "title"> | null;
};

export type PostDetailResponse = Post & PostNavigation;

export type PostsResponse = PaginationMeta & {
  posts: PostItem[];
};
