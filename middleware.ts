import { PAGE_PATH } from "@/constants/paths";
import { OAUTH_PARAMS } from "@/constants/system";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 세션 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const isProtectedPath = PAGE_PATH.adminOnly.some((path) =>
    pathname.startsWith(path),
  );

  // [보호된 경로 설정]
  // 로그인이 필요한 페이지에 비로그인 유저가 접근하면 로그인 페이지로 리다이렉트
  if (isProtectedPath && !user) {
    const url = new URL(PAGE_PATH.login, request.url);
    // 원래 가려던 주소
    url.searchParams.set(OAUTH_PARAMS.next, pathname);
    url.searchParams.set(OAUTH_PARAMS.message, "로그인이 필요한 페이지입니다.");

    return NextResponse.redirect(url);
  }

  return response;
};

// 미들웨어가 실행될 경로
export const config = {
  matcher: [
    /*
     * 아래 경로를 제외한 모든 요청에 미들웨어 실행:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘)
     * - public 폴더 내 파일들
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
