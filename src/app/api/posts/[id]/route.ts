import { NextRequest, NextResponse } from 'next/server';
import { getPublicPost } from '@/services/postService';
import { handleRouteError } from '@/utils/error';

export type PostParams = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = async (_request: NextRequest, { params }: PostParams) => {
  try {
    const { id } = await params;
    const post = await getPublicPost(id);

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    return handleRouteError(error);
  }
};
