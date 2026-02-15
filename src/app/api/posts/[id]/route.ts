import { NextRequest, NextResponse } from "next/server";
import { deletePost, getPost, updatePost } from "@/services/postService";
import { handleRouteError } from "@/utils/error";
import { QUERY_PARAMS } from "@/constants/system";

export type PostParams = {
  params: {
    id: string;
  };
};

export const GET = async (request: NextRequest, { params }: PostParams) => {
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

export const PATCH = async (request: Request, { params }: PostParams) => {
  try {
    const body = await request.json();
    const updatedPost = await updatePost(params.id, body);

    return NextResponse.json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    return handleRouteError(error);
  }
};

export const DELETE = async (_request: Request, { params }: PostParams) => {
  try {
    await deletePost(params.id);

    return NextResponse.json({
      success: true,
      message: "게시글이 삭제되었습니다.",
    });
  } catch (error) {
    return handleRouteError(error);
  }
};
