import "server-only";

import { createServerSupabaseClient } from "@/libs/supabase/server";
import { getAuthUser } from "./authService";
import { AppError } from "@/utils/error";
import { Category, CategorySlug } from "@/types/blog";
import { cache } from "react";

export const validateCategoryAccess = async (categorySlug: CategorySlug) => {
  const [user, categories] = await Promise.all([
    getAuthUser(),
    getCategories(),
  ]);

  const category = categories.find((c) => c.slug === categorySlug);

  // 존재하지 않는 카테고리 체크
  if (!category) {
    throw AppError.notFound("존재하지 않는 카테고리입니다.");
  }

  // 비공개 카테고리 권한 체크
  if (category.isPrivate && !user?.isAdmin) {
    throw AppError.forbidden("접근 권한이 없습니다.");
  }
};

export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, is_private");

  if (error) throw AppError.fromSupabase(error);
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    isPrivate: row.is_private,
  }));
});
