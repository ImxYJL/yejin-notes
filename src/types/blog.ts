import { CATEGORY_MAP } from '@/constants/blog';
import { PaginationMeta } from './page';

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

// 목록용 미리보기
export type PostItem = Omit<Post, 'content' | 'updatedAt' | 'category'>;

export type PostNavigation = {
  prevPost: Pick<Post, 'id' | 'title'> | null;
  nextPost: Pick<Post, 'id' | 'title'> | null;
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
  updated_at: string;
  // Supabase SDK가 FK join 결과를 배열로 추론하는 quirk로 인해 union 타입
  category: { slug: string; name: string } | { slug: string; name: string }[];
  draft_data: DraftData | null;
};

export type PostItemRow = Pick<
  PostRow,
  | 'id'
  | 'title'
  | 'summary'
  | 'tags'
  | 'thumbnail_url'
  | 'is_private'
  | 'is_published'
  | 'created_at'
>;

export type PublishedPostRow = Omit<PostRow, 'draft_data'>;

/** -----------------------------------------------------------
 * 4. DTO & Form (생성, 수정, 입력)
 * ----------------------------------------------------------- */

export type DraftData = Pick<
  Post,
  'title' | 'content' | 'summary' | 'tags' | 'thumbnailUrl' | 'isPrivate'
>;

export type EditorPost = Post;

export type DraftPostItem = Pick<Post, 'createdAt' | 'title' | 'id'>;

export type PostForm = Omit<Post, 'createdAt' | 'updatedAt' | 'category' | 'id'> & {
  categorySlug: CategorySlug;
  id?: string;
};

export type PostImg = Pick<Post, 'thumbnailUrl' | 'content'>;

export type CategoryMap = Record<CategorySlug, Category>;

export type EditorMode = 'create' | 'edit';

/** -----------------------------------------------------------
 * 5. Response & Navigation (API 응답)
 * ----------------------------------------------------------- */

export type PostDetailResponse = Post & PostNavigation;

export type PostsResponse = PaginationMeta & {
  posts: PostItem[];
};

export type SaveDraftResponse = {
  id: string;
};
