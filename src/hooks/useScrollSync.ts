import { useRef, useCallback } from "react";

export const useScrollSync = () => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;

    if (!editor || !preview) return;

    // 1. 에디터의 현재 스크롤 비율 계산 (현재 위치 / 전체 스크롤 가능 높이)
    const { scrollTop, scrollHeight, clientHeight } = editor;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);

    // 2. 미리보기 영역에 동일한 비율 적용
    const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
    preview.scrollTop = scrollPercentage * previewScrollHeight;
  }, []);

  return { editorRef, previewRef, handleScroll };
};
