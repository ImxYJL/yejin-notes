import { useMutation } from '@tanstack/react-query';
import uploadImage from '@/services/imageService';
import { useToastStore } from '@/store/useToastStore';
import { ImgFolder } from '@/types/file';

type UploadParams = {
  file: File;
  path: ImgFolder;
};

const useSaveImage = () => {
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: async ({ file, path }: UploadParams) => {
      const Compressor = (await import('compressorjs')).default;
      const extension = file.name.split('.').pop() ?? 'jpg';

      const compressedFile = await new Promise<Blob>((resolve, reject) => {
        new Compressor(file, {
          quality: 0.8,
          maxWidth: 1200,
          convertSize: 1000000, // 1MB 이상일 때만 압축
          success: (result) => resolve(result),
          error: (err) => reject(err),
        });
      });

      return await uploadImage(compressedFile, 'blog', path, extension);
    },
    onError: () => showToast('이미지 업로드 도중 에러가 발생했습니다.'),
  });
};

export default useSaveImage;
