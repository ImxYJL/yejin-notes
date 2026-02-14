import "server-only";

import { createServerSupabaseClient } from "@/libs/supabase/server";
import { getAuthUser } from "./authService";
import { AppError } from "@/utils/error";

export const validateCategoryAccess = async (categoryName: string) => {
  const supabase = await createServerSupabaseClient();
  const user = await getAuthUser();

  const { data: category, error } = await supabase
    .from("categories")
    .select("is_private")
    .eq("name", categoryName)
    .single();

  // 1. 카테고리가 존재하지 않는 경우
  if (error || !category) {
    throw AppError.notFound(null, "존재하지 않는 카테고리입니다.");
  }

  // 2. 비공개 카테고리인데 관리자가 아닌 경우
  if (category.is_private && !user) {
    throw AppError.forbidden(null, "해당 카테고리에 접근할 권한이 없습니다.");
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
