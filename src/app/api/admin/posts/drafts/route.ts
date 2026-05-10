import { getDrafts } from '@/services/postService';
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
