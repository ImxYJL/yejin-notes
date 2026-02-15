import "server-only";

import { createServerSupabaseClient } from "@/libs/supabase/server";
import { AppError } from "@/utils/error";
import { validateCategoryAccess } from "./categoryService";
import { getAuthUser } from "./authService";

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
    .select("*")
    .eq("id", postId)
    .single();

  if (error || !data) throw AppError.notFound();

  const user = await getAuthUser();
  if (data.is_private && !user) {
    throw AppError.forbidden();
  }

  return {
    id: data.id,
    title: data.title,
    summary: data.summary,
    content: data.content,
    categoryId: data.category_id,
    tags: data.tags || [],
    isPrivate: data.is_private,
    isPublished: data.is_published,
    thumbnailUrl: data.thumbnail_url,
    createdAt: data.created_at,
  };
};
