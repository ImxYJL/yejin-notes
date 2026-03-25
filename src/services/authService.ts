import 'server-only';

import { createServerSupabaseClient } from '@/libs/supabase/server';
import { AppError } from '@/utils/error';
import { cache } from 'react';
import { AuthUser } from '@/types/auth';

// 구글 로그인 후 받은 코드를 세션으로 교환
export const exchangeCode = async (code: string) => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) throw new Error(error.message);
  return data;
};

export const getAuthUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return {
    id: user.id,
    isAdmin: user.email === process.env.ADMIN_EMAIL,
  };
});

export const checkIsAdmin = async () => {
  const user = await getAuthUser();

  return user?.isAdmin ?? false;
};

export const validateAuth = async () => {
  const user = await getAuthUser();
  if (!user) throw AppError.unauthorized();

  return user;
};

export const validateAdmin = async () => {
  const user = await validateAuth();
  if (!user.isAdmin) throw AppError.forbidden('관리자 권한이 없습니다.');

  return user;
};
