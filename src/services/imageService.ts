import { createServerSupabaseClient } from '@/libs/supabase/server';
import { AppError } from '@/utils/error';
import { v4 as uuidv4 } from 'uuid';

type BucketName = 'blog';
type FolderPath = 'thumbnails' | 'content';

/**
 * Supabase Storage에 이미지를 업로드하고 Public URL을 반환하는 함수
 */
const uploadImage = async (file: File, bucket: BucketName, path: FolderPath) => {
  const supabase = await createServerSupabaseClient();

  // 유니크한 파일명 생성 (확장자 유지)
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw AppError.forbidden('접근 권한이 없습니다.');
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

export default uploadImage;
