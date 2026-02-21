import { NextRequest, NextResponse } from "next/server";
import { getPosts, upsertPost } from "@/services/postService";
import { handleRouteError } from "@/utils/error";
import { QUERY_PARAMS } from "@/constants/system";
import { isCategorySlug } from "@/utils/type";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const categorySlug = searchParams.get(QUERY_PARAMS.categorySlug);
    const page = Number(searchParams.get(QUERY_PARAMS.page)) || 1;
    const limit = Number(searchParams.get(QUERY_PARAMS.limit)) || undefined;

    if (!isCategorySlug(categorySlug)) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 카테고리입니다." },
        { status: 400 },
      );
    }

    const result = await getPosts(categorySlug, page, limit);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleRouteError(error);
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    const post = await upsertPost(body);

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    return handleRouteError(error);
  }
};

// patch 담당 (로직은 위의 post와 동일함!)
export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const post = await upsertPost(body);
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return handleRouteError(error);
  }
};
