import "server-only";

import { createServerSupabaseClient } from "@/libs/supabase/server";
import { AppError } from "@/utils/error";
import { validateCategoryAccess } from "./categoryService";
import { getAuthUser, validateAuth } from "./authService";
import { CategorySlug, Post, PostForm, PostItem, PostRow } from "@/types/blog";

const DEFAULT_PAGE_LIMIT = 10;
const MAX_PAGE_LIMIT = 50;

export const getPosts = async (
  categorySlug: CategorySlug,
  page: number = 1,
  limit?: number,
) => {
  const supabase = await createServerSupabaseClient();
  const user = await getAuthUser();

  await validateCategoryAccess(categorySlug);

  const LIMIT = Math.min(limit || DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT);
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  const query = supabase
    .from("posts")
    .select(
      `
      id, title, summary, category_id, tags, 
      is_private, is_published, thumbnail_url, created_at, updated_at,
      category:categories!inner(slug, name)
    `,
      { count: "exact" },
    )
    .eq("category.slug", categorySlug)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (!user) {
    query.eq("is_private", false).eq("is_published", true);
  }

  const { data, count, error } = await query;
  if (error) throw AppError.fromSupabase(error);

  return {
    posts: (data || []).map(mapPostItemResponse),
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / LIMIT),
    currentPage: page,
  };
};

export const getPost = async (postId: string) => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
    *,
    category:categories (
      slug,
      name
      )
      `,
    )
    .eq("id", postId)
    .single();
  if (error || !data) throw AppError.notFound();

  await validateCategoryAccess(data.category.slug);

  const user = await getAuthUser();
  if (data.is_private && !user) {
    throw AppError.forbidden();
  }

  return mapPostDetailResponse(data);
};

export const upsertPost = async (formData: PostForm): Promise<Post> => {
  const user = await validateAuth(); // 작성자 권한 체크
  const supabase = await createServerSupabaseClient();

  // 💡 categoryId를 가져오는 로직을 더 명확하게 처리
  const categoryId = await getCategoryIdBySlug(formData.categorySlug);

  const { data, error } = await supabase
    .from("posts")
    .upsert(
      {
        id: formData.id,
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        category_id: categoryId,
        tags: formData.tags,
        is_private: formData.isPrivate,
        is_published: formData.isPublished,
        thumbnail_url: formData.thumbnailUrl,
        user_id: user.id,
      },
      { onConflict: "id" },
    )
    .select(`*, category:categories!inner(slug, name)`)
    .single();

  if (error) throw AppError.fromSupabase(error);
  if (!data) throw AppError.internal("데이터 처리에 실패했습니다.");

  return mapPostDetailResponse(data);
};

export const deletePost = async (id: string) => {
  await validateAuth();

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) throw AppError.fromSupabase(error);
};

/**
 * 서비스 유틸리티
 */

export const mapPostItemResponse = (
  row: Omit<PostRow, "content" | "category">,
): PostItem => {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    tags: row.tags || [],
    thumbnailUrl: row.thumbnail_url,
    isPrivate: row.is_private,
    isPublished: row.is_published,
    createdAt: row.created_at,
  };
};

export const mapPostDetailResponse = (row: PostRow): Post => {
  return {
    ...mapPostItemResponse(row),
    content: row.content,
    updatedAt: row.updated_at || row.created_at,
    category: {
      slug: (row.category.slug as CategorySlug) || "dev",
      name: row.category.name,
    },
  };
};

export const getCategoryIdBySlug = async (slug: string) => {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    throw AppError.notFound(null, "존재하지 않는 카테고리입니다.");
  }

  return data.id;
};
