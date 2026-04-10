import { NextRequest, NextResponse } from 'next/server';
import { deletePost, getAdminPost, upsertPost } from '@/services/postService';
import { AppError, handleRouteError } from '@/utils/error';
import { CategorySlug } from '@/types/blog';
import { isCategorySlug } from '@/utils/type';

export type PostParams = {
  params: Promise<{
    id: string;
    categorySlug: string;
  }>;
};

export const GET = async (_request: NextRequest, { params }: PostParams) => {
  try {
    const { id } = await params;
    const post = await getAdminPost(id);

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
    const { id, categorySlug } = await params;

    if (!isCategorySlug(categorySlug)) {
      throw AppError.notFound();
    }

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
    const { id, categorySlug } = await params;

    if (!isCategorySlug(categorySlug)) {
      throw AppError.notFound();
    }

    await deletePost(id, categorySlug);

    return NextResponse.json({
      success: true,
      message: '게시글이 삭제되었습니다.',
    });
  } catch (error) {
    return handleRouteError(error);
  }
};
