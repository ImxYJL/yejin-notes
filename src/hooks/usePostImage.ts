import { insertTextAtCursor } from '@/components/editor/ContentEditor';
import useSaveImage from '@/queries/useSaveImage';
import { PostImg } from '@/types/blog';
import { useMemo, RefObject } from 'react';

type UsePostImageProps = {
  content: string;
  onUpdateField: (field: keyof PostImg, value: string) => void;
  editorRef: RefObject<HTMLTextAreaElement | null>;
};

const usePostImage = ({ content, onUpdateField, editorRef }: UsePostImageProps) => {
  const { mutateAsync: upload, isPending, error } = useSaveImage();

  // 1. 본문 이미지 추출 (자동 썸네일용이나 리스트용)
  const contentImages = useMemo(() => {
    const regex = /!\[.*?\]\((.*?)\)/g;
    const matches = [...content.matchAll(regex)];

    return matches.map((match) => match[1]);
  }, [content]);

  // 2. 본문 커서 위치에 이미지 삽입
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
    isProcessing: isPending,
    error,
  };
};

export default usePostImage;
