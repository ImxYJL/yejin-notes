import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { cache } from 'react';

/**
 * createServerSupabaseClient (SSR)
 * - 서버에서 쿠키 기반으로 로그인 사용자 식별
 * - auth.uid() 사용 가능 (RLS에서 사용자별 접근 제어)
 * - 요청마다 다른 사용자 데이터를 반환
 * - cookies() 사용 → 해당 route는 무조건 dynamic 강제
 */
export const createServerSupabaseClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // 서버 컴포넌트에서 쿠키 수정 시 발생하는 에러 무시
          }
        },
      },
    },
  );
});
