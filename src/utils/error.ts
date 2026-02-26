import { AppErrorCode } from "@/types/error";
import { NextResponse } from "next/server";

export class AppError extends Error {
  constructor(
    public code: AppErrorCode,
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }

  static unauthorized = (details?: unknown, message = "인증이 필요합니다.") =>
    new AppError("UNAUTHORIZED", message, 401, details);

  static forbidden = (details?: unknown, message = "권한이 없습니다.") =>
    new AppError("FORBIDDEN", message, 403, details);

  static validation = (
    details?: unknown,
    message = "입력값을 확인해 주세요.",
  ) => new AppError("VALIDATION", message, 400, details);

  static duplicate = (
    details?: unknown,
    message = "이미 존재하는 항목입니다.",
  ) => new AppError("DUPLICATE", message, 409, details);

  static notFound = (details?: unknown, message = "대상을 찾을 수 없습니다.") =>
    new AppError("NOT_FOUND", message, 404, details);

  static rateLimit = (
    details?: unknown,
    message = "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
  ) => new AppError("RATE_LIMIT", message, 429, details);

  static internal = (
    details?: unknown,
    message = "서버 오류가 발생했습니다.",
  ) => new AppError("INTERNAL", message, 500, details);

  // Supabase 전용 변환기
  static fromSupabase = (error: { code: string; message: string }) => {
    switch (error.code) {
      case "23505":
        return AppError.duplicate(null, "중복된 데이터가 존재합니다.");
      case "PGRST116":
        return AppError.notFound(null, "데이터를 찾을 수 없습니다.");
      case "42501":
        return AppError.forbidden(null, "접근 권한이 없습니다.");
      case "42703":
        return AppError.validation(null, `DB 쿼리 오류: ${error.message}`);
      default:
        return AppError.internal(null, error.message);
    }
  };
}

export const isAppError = (e: unknown): e is AppError => e instanceof AppError;

export const appErrorToResponse = (e: AppError) =>
  NextResponse.json(
    {
      success: false,
      code: e.code,
      message: e.message,
      details: e.details,
    },
    { status: e.status },
  );

export const handleRouteError = (e: unknown) => {
  // 1. 진짜 AppError인지 플래그로 확인
  if (isAppError(e)) return appErrorToResponse(e);

  // 2. 만약 AppError가 아닌데 code와 message가 있다면 Supabase 에러로 간주
  if (typeof e === "object" && e !== null && "code" in e && "message" in e) {
    // 💡 여기서 로그를 찍어보세요!
    console.log("[Supabase or Unknown Error]:", e);

    return appErrorToResponse(
      AppError.fromSupabase(e as { code: string; message: string }),
    );
  }

  // 3. 진짜 알 수 없는 에러
  console.error("[unhandled_error]:", e);
  return appErrorToResponse(AppError.internal());
};

// export const handleRouteError = (e: unknown) => {
//   if (isAppError(e)) return appErrorToResponse(e);

//   // Supabase 에러 객체인 경우 (code와 message가 있는 경우)
//   if (typeof e === "object" && e !== null && "code" in e && "message" in e) {
//     return appErrorToResponse(
//       AppError.fromSupabase(e as { code: string; message: string }),
//     );
//   }

//   if (process.env.NODE_ENV !== "production") {
//     console.error("[unhandled_error]:", e);
//   }

//   return appErrorToResponse(AppError.internal());
// };
