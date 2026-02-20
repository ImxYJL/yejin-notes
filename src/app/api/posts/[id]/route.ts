import { NextRequest, NextResponse } from "next/server";
import { deletePost, getPost, upsertPost } from "@/services/postService";
import { handleRouteError } from "@/utils/error";

export type PostParams = {
  params: {
    id: string;
  };
};

export const GET = async (_request: NextRequest, { params }: PostParams) => {
  try {
    const post = await getPost(params.id);

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
    const { id } = params;
    const body = await request.json();

    const updatedPost = await upsertPost({ ...body, id });

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
