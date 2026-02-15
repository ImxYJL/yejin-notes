import { NextRequest, NextResponse } from "next/server";
import { getPost } from "@/services/postService";
import { handleRouteError } from "@/utils/error";
import { QUERY_PARAMS } from "@/constants/system";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get(QUERY_PARAMS.category);

    if (!categoryName) {
      return NextResponse.json(
        { success: false, message: "카테고리를 설정해주세요." },
        { status: 400 },
      );
    }

    const post = await getPost(categoryName, params.id);

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    return handleRouteError(error);
  }
};
