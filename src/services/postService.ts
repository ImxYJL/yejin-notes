import "server-only";

import { createServerSupabaseClient } from "@/libs/supabase/server";
import { AppError } from "@/utils/error";
import { validateCategoryAccess } from "./categoryService";
import { getAuthUser, validateAuth } from "./authService";
import {
  CategorySlug,
  CreatePostInput,
  Post,
  PostDetailResponse,
  PostRow,
  UpdatePostInput,
} from "@/types/blog";

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
      is_private, is_published, thumbnail_url, created_at,
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
    posts: data || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / LIMIT),
    currentPage: page,
  };
};

export const getPost = async (categorySlug: CategorySlug, postId: string) => {
  await validateCategoryAccess(categorySlug);

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

  const user = await getAuthUser();
  if (data.is_private && !user) {
    throw AppError.forbidden();
  }

  return data.map(mapPostResponse);
};

export const createPost = async (input: CreatePostInput): Promise<Post> => {
  const user = await validateAuth();
  const supabase = await createServerSupabaseClient();

  const categoryId = await getCategoryIdBySlug(input.categorySlug);

  const { data, error } = await supabase
    .from("posts")
    .insert({
      id: input.id,
      title: input.title,
      content: input.content,
      summary: input.summary,
      category_id: categoryId,
      tags: input.tags,
      is_private: input.isPrivate,
      is_published: input.isPublished,
      thumbnail_url: input.thumbnailUrl,
      user_id: user.id, // 작성자 정보 추가
    })
    .select(
      `
      *,
      category:categories!inner(slug, name)
    `,
    )
    .single();

  if (error) throw AppError.fromSupabase(error);
  if (!data) throw AppError.internal("게시글 생성에 실패했습니다.");

  return mapPostResponse(data);
};

export const updatePost = async (
  id: string,
  input: UpdatePostInput,
): Promise<PostDetailResponse> => {
  await validateAuth();
  const user = await validateAuth();
  const supabase = await createServerSupabaseClient();

  const userId = user.id;

  let categoryId: string | undefined;
  if (input.categorySlug) {
    categoryId = await getCategoryIdBySlug(input.categorySlug);
  }

  const { data, error } = await supabase
    .from("posts")
    .update({
      title: input.title,
      content: input.content,
      summary: input.summary,
      category_id: categoryId,
      tags: input.tags,
      is_private: input.isPrivate,
      is_published: input.isPublished,
      thumbnail_url: input.thumbnailUrl,
    })
    .eq("id", id) 
    .eq("user_id", userId) 
    .select(
      `
      *,
      category:categories!inner(slug, name)
    `,
    )
    .single();

  if (error) throw AppError.fromSupabase(error);
  if (!data) throw AppError.notFound(null, "수정할 게시글을 찾을 수 없습니다.");

  return data.map(mapPostResponse);
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

export const mapPostResponse = (row: PostRow): Post => {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    summary: row.summary,
    category: {
      slug: (row.category.slug as CategorySlug) || "dev",
      name: row.category.name,
    },
    tags: row.tags || [],
    thumbnailUrl: row.thumbnail_url,
    isPrivate: row.is_private,
    isPublished: row.is_published,
    createdAt: row.created_at,
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
