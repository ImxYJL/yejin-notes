import { NextRequest, NextResponse } from "next/server";
import { getPosts } from "@/services/postService";
import { handleRouteError } from "@/utils/error";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get(QUERY_PARAMS.category) ?? undefined;

    const posts = await getPosts(categoryName);

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    return handleRouteError(error);
  }
};
