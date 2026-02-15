import "server-only";

import { createServerSupabaseClient } from "@/libs/supabase/server";
import { AppError } from "@/utils/error";
import { validateCategoryAccess } from "./categoryService";
import { getAuthUser, validateAuth } from "./authService";
import {
  CategorySlug,
  CreatePostInput,
  PostDetail,
  PostRow,
  UpdatePostInput,
} from "@/types/blog";

export const getPosts = async (categoryName?: string) => {
  const supabase = await createServerSupabaseClient();
  const user = await getAuthUser();

  if (categoryName) {
    await validateCategoryAccess(categoryName);
  }

  let query = supabase
    .from("posts")
    .select(
      `
      id, 
      title, 
      summary, 
      category_id, 
      tags, 
      is_private, 
      is_published, 
      thumbnail_url, 
      created_at
    `,
    )
    .order("created_at", { ascending: false });

  if (categoryName) {
    query = query.eq("category_id", categoryName);
  }

  if (!user) {
    query = query.eq("is_private", false).eq("is_published", true);
  }

  const { data, error } = await query;
  if (error) throw AppError.fromSupabase(error);
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    summary: row.summary,
    categoryId: row.category_id,
    tags: row.tags || [],
    isPrivate: row.is_private,
    isPublished: row.is_published,
    thumbnailUrl: row.thumbnail_url,
    createdAt: row.created_at,
  }));
};

export const getPost = async (categoryName: string, postId: string) => {
  await validateCategoryAccess(categoryName);

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

export const createPost = async (input: CreatePostInput) => {
  const user = await validateAuth();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: input.title,
      content: input.content,
      summary: input.summary,
      category_id: input.categoryId,
      tags: input.tags,
      is_private: input.isPrivate,
      is_published: input.isPublished,
      thumbnail_url: input.thumbnailUrl,
      user_id: user.id, // 작성자 정보 추가
    })
    .select()
    .single();

  if (error) throw AppError.fromSupabase(error);
  if (!data) throw AppError.internal("게시글 생성에 실패했습니다.");

  return data.map(mapPostResponse);
};

export const updatePost = async (
  id: string,
  input: UpdatePostInput,
): Promise<PostDetail> => {
  await validateAuth();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .update({
      title: input.title,
      content: input.content,
      summary: input.summary,
      category_id: input.categoryId,
      tags: input.tags,
      is_private: input.isPrivate,
      is_published: input.isPublished,
      thumbnail_url: input.thumbnailUrl,
    })
    .eq("id", id)
    .select()
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

const mapPostResponse = (row: PostRow): PostDetail => ({
  id: row.id,
  title: row.title,
  content: row.content,
  summary: row.summary,
  categoryId: row.category_id,
  category: {
    slug: (row.category.slug as CategorySlug) || "dev",
    name: row.category.name,
  },
  tags: row.tags || [],
  isPrivate: row.is_private,
  isPublished: row.is_published,
  thumbnailUrl: row.thumbnail_url,
  createdAt: row.created_at,
});
