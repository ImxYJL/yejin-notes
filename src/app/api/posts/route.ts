import { NextRequest, NextResponse } from "next/server";
import { createPost, getPosts } from "@/services/postService";
import { handleRouteError } from "@/utils/error";
import { QUERY_PARAMS } from "@/constants/system";

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

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const newPost = await createPost(body);

    return NextResponse.json({
      success: true,
      data: newPost,
    });
  } catch (error) {
    return handleRouteError(error);
  }
};
