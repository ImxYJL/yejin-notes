import "server-only";

import { createServerSupabaseClient } from "@/libs/supabase/server";
import { getAuthUser } from "./authService";
import { AppError } from "@/utils/error";
import { CATEGORY_MAP } from "@/constants/blog";
import { CategorySlug } from "@/types/blog";

export const validateCategoryAccess = async (categorySlug: CategorySlug) => {
  const user = await getAuthUser();

  const category = CATEGORY_MAP[categorySlug];

  if (!category) {
    throw AppError.notFound("존재하지 않는 카테고리입니다.");
  }

  if (category.isPrivate && !user) {
    throw AppError.forbidden("접근 권한이 없습니다.");
  }
};

export const getCategories = async () => {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, is_private");

  if (error) throw AppError.fromSupabase(error);
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    isPrivate: row.is_private,
  }));
};
