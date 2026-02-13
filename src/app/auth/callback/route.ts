import { NextResponse } from "next/server";
import { exchangeCode } from "@/services/authService";
import { OAUTH_PARAMS, SUPABASE_KEY } from "@/constants/system";
import { PAGE_PATH } from "@/constants/paths";

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get(SUPABASE_KEY.code);
  const next = searchParams.get(OAUTH_PARAMS.next) ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}${PAGE_PATH.login}?${OAUTH_PARAMS.message}=잘못된 접근입니다.`);
  }

  try {
    await exchangeCode(code);

    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    console.error("Auth Error:", error);
    
    return NextResponse.redirect(
      `${origin}${PAGE_PATH.login}?${OAUTH_PARAMS.message}=인증에 실패했습니다.`,
    );
  }
};
