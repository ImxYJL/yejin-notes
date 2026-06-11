import { deleteDraft, getEditorPost } from '@/services/postService';
import { handleRouteError } from '@/utils/error';
import { NextResponse } from 'next/server';

type DraftParams = {
  params: Promise<{ id: string }>;
};

export const GET = async (_request: Request, { params }: DraftParams) => {
  try {
    const { id } = await params;
    const draft = await getEditorPost(id);

    return NextResponse.json({
      success: true,
      data: draft,
    });
  } catch (error) {
    console.error(error);
    return handleRouteError(error);
  }
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
