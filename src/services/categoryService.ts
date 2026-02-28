import "server-only";

import { createServerSupabaseClient } from "@/libs/supabase/server";
import { getAuthUser } from "./authService";
import { AppError } from "@/utils/error";
import { Category, CategorySlug } from "@/types/blog";

export const validateCategoryAccess = async (categorySlug: CategorySlug) => {
  const user = await getAuthUser();
  const categories = await getCategories();

  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    throw AppError.notFound("존재하지 않는 카테고리입니다.");
  }

  if (category.isPrivate && !user) {
    throw AppError.forbidden("접근 권한이 없습니다.");
  }
};

export const getCategories = async (): Promise<Category[]> => {
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
};
