import { useRef, useCallback } from 'react';

export const useScrollSync = () => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // TODO: editor/preview 타입 일원화하기
  const activeScroller = useRef<'editor' | 'preview' | null>(null);

  const handleScroll = useCallback((source: 'editor' | 'preview') => {
    // 현재 마우스가 올라간 쪽이 아니라면 스크롤 동기화 로직을 수행하지 않음 (무한 루프 차단)
    if (activeScroller.current !== source) return;

    const editor = editorRef.current;
    const preview = previewRef.current;

    if (!editor || !preview) return;

    requestAnimationFrame(() => {
      if (source === 'editor') {
        // 에디터 -> 프리뷰 동기화
        const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
        // 0으로 나누기 방지 (초기 로딩 시)
        if (!isNaN(ratio)) {
          preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
        }
      } else {
        // 프리뷰 -> 에디터 동기화
        const ratio =
          preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
        if (!isNaN(ratio)) {
          editor.scrollTop = ratio * (editor.scrollHeight - editor.clientHeight);
        }
      }
    });
  }, []);

  const handleMouseEnter = useCallback((source: 'editor' | 'preview') => {
    activeScroller.current = source;
  }, []);

  return {
    editorRef,
    previewRef,
    handleScroll,
    handleMouseEnter,
  };
};
