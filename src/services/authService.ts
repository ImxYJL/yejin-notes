import "server-only";

import { createServerSupabaseClient } from "@/libs/supabase/server";
import { AppError } from "@/utils/error";

// 구글 로그인 후 받은 코드를 세션으로 교환
export const exchangeCode = async (code: string) => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) throw new Error(error.message);
  return data;
};

export const getAuthUser = async () => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return {
    id: user.id,
    email: user.email,
    fullName: user.user_metadata.full_name,
    avatarUrl: user.user_metadata.avatar_url,
  };
};

export const checkIsAdmin = async () => {
  return !!(await getAuthUser());
};

export const validateAuth = async () => {
  const user = await getAuthUser();
  if (!user) throw AppError.unauthorized(); 

  return user;
};
