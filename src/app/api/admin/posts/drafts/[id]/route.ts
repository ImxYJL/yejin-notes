import { deleteDraft } from '@/services/postService';
import { handleRouteError } from '@/utils/error';
import { NextResponse } from 'next/server';

type DraftParams = {
  params: Promise<{ id: string }>;
};

export const DELETE = async (_request: Request, { params }: DraftParams) => {
  try {
    const { id } = await params;

    await deleteDraft(id);

    return NextResponse.json({
      success: true,
      message: '임시저장된 글이 삭제되었습니다.',
    });
  } catch (error) {
    return handleRouteError(error);
  }
};
