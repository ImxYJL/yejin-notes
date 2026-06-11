import { getDrafts, saveDraft } from '@/services/postService';
import { handleRouteError } from '@/utils/error';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const drafts = await getDrafts();

    return NextResponse.json({
      success: true,
      data: drafts,
    });
  } catch (error) {
    return handleRouteError(error);
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const post = await saveDraft(body);

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error(error);
    return handleRouteError(error);
  }
};
