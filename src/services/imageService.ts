import { ImageBucket, ImgFolder } from '@/types/file';
import { AppError } from '@/utils/error';
import { v4 as uuidv4 } from 'uuid';
import { createSupabaseClient } from '@/libs/supabase/client';

/**
 * Supabase Storage에 이미지를 업로드하고 Public URL을 반환하는 함수
 */
const uploadImage = async (
  file: Blob,
  bucket: ImageBucket,
  path: ImgFolder,
  fileExtension: string,
) => {
  const supabase = await createSupabaseClient();

  // 유니크한 파일명 생성 (확장자 유지)
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw AppError.upstream('이미지 업로드 도중 에러가 발생했습니다.');
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

export default uploadImage;
