import { insertTextAtCursor } from '@/components/editor/ContentEditor';
import useSaveImage from '@/queries/useSaveImage';
import { PostImg } from '@/types/blog';
import { extractImages, getThumbnail } from '@/utils/markdowns/regex';
import { RefObject } from 'react';

type UsePostImageProps = {
  content: string;
  onUpdateField: (field: keyof PostImg, value: string) => void;
  editorRef: RefObject<HTMLTextAreaElement | null>;
};

const usePostImage = ({ content, onUpdateField, editorRef }: UsePostImageProps) => {
  const { mutateAsync: upload, isPending, error } = useSaveImage();

  const contentImages = extractImages(content);
  const autoThumbnail = getThumbnail(content);

  const insertImage = async (file: File) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    try {
      const url = await upload({ file, path: 'content' });

      if (url) {
        const imageMarkdown = `\n![image](${url})\n`;

        insertTextAtCursor(textarea, imageMarkdown, content, (nextVal) =>
          onUpdateField('content', nextVal),
        );
      }
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
    }
  };

  const selectThumbnail = (url: string) => {
    onUpdateField('thumbnailUrl', url);
  };

  return {
    insertImage,
    selectThumbnail,
    contentImages,
    autoThumbnail,
    isProcessing: isPending,
    error,
  };
};

export default usePostImage;
