import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

/**
 * publicSupabase
 * - anon key 기반 비로그인 전용클라이언트
 * - 세션/쿠키 사용 ❌ (항상 anon role)
 * - RLS에서 anon 정책만 적용됨
 * - 서버/클라이언트 어디서든 동일하게 동작
 * - Next.js static 렌더링에 안전
 */
export const publicSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

/**
 * createSupabaseClient (browser)
 * - 브라우저에서 사용하는 인증 클라이언트
 * - localStorage/cookie 기반으로 로그인 세션 유지
 * - 로그인 시 JWT 자동 포함 → auth.uid() 사용 가능
 * - 클라이언트 컴포넌트에서만 사용
 * - static/dynamic에는 영향 없음 (서버 아님)
 */
export const createSupabaseClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
