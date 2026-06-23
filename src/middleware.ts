import { PAGE_PATH } from '@/constants/paths';
import { OAUTH_PARAMS } from '@/constants/system';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // 1. [필터링] 미들웨어가 개입할 필요가 없는 요청들 우선 처리
  // - Next.js 내부 요청 (prefetch, static, image 등)
  // - 정적 파일들

  // admin 경로는 early return 없이 항상 인증 체크
  const isAdminPath = (p: string) =>
    p.startsWith('/admin') || p.startsWith('/api/admin');

  if (!isAdminPath(pathname)) {
    if (
      request.headers.get('x-middleware-prefetch') ||
      pathname.startsWith('/_next') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }
  }

  // 2. 응답 객체 초기화
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 3. Supabase 클라이언트 설정 (쿠키 핸들링 포함)
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

  // 4. 세션 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 5. 어드민 여부 확인
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  // 6. [리다이렉트 로직] 어드민 경로에 비로그인 또는 비어드민 접근 시
  if (isAdminPath(pathname) && (!user || !isAdmin)) {
    // API 요청이라면 리다이렉트 대신 401 반환
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const url = new URL(PAGE_PATH.login, request.url);
    url.searchParams.set(OAUTH_PARAMS.next, pathname);
    url.searchParams.set(OAUTH_PARAMS.message, '로그인이 필요한 페이지입니다.');

    return NextResponse.redirect(url);
  }

  return response;
};

// 미들웨어가 실행될 경로 (정적 리소스 제외 최적화)
export const config = {
  matcher: [
    /*
     * 아래 경로들을 제외한 모든 요청에 미들웨어 실행:
     * - _next/static, _next/image, favicon.ico 등
     * - 이미지, 폰트 등 정적 파일 확장자
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|css)$).*)',
  ],
};
