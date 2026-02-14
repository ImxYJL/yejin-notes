/**
 * 외부 라이브러리 및 서비스(Google, Supabase 등), 미들웨어에서
 * 고정적으로 사용하는 예약어 상수
 */
export const SUPABASE_KEY = {
  code: "code",
  error: "error",
  errorDescription: "error_description",
} as const;

export const OAUTH_PARAMS = {
  next: "next",
  message: "message", // 임의로 지정한 next middleware 메세지 전달용 파라미터
} as const;

export const QUERY_PARAMS = {
  category: "category",
} as const;
