import { NextRequest, NextResponse } from 'next/server';
import { getAdminPosts, upsertPost } from '@/services/postService';
import { AppError, handleRouteError } from '@/utils/error';
import { QUERY_PARAMS } from '@/constants/system';
import { isCategorySlug } from '@/utils/type';

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const categorySlug = searchParams.get(QUERY_PARAMS.categorySlug);
    const page = Number(searchParams.get(QUERY_PARAMS.page)) || 1;
    const limit = Number(searchParams.get(QUERY_PARAMS.limit)) || undefined;

    if (!isCategorySlug(categorySlug)) {
      throw AppError.notFound();
    }

    const result = await getAdminPosts(categorySlug, page, limit);

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
