import { ChangeEvent, KeyboardEvent, memo } from 'react';
import { Textarea } from '../common';

type ContentEditorProps = {
  value: string;
  onChange: (val: string) => void;
  onScroll: () => void;
  onImgPaste: (file: File) => void;
  ref?: React.RefObject<HTMLTextAreaElement | null>;
};

const ContentEditor = memo(
  ({ value, onChange, onScroll, onImgPaste, ref }: ContentEditorProps) => {
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const item = e.clipboardData.items[0];

      if (item?.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault(); // 이미지 텍스트 데이터가 붙여넣어지는 것 방지
          onImgPaste(file);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      handleTabSupport(e, value, onChange);
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    };

    return (
      <Textarea
        variant="outline"
        placeholder="여기에 입력해주세요"
        value={value}
        onChange={handleChange}
        onScroll={onScroll}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        ref={ref}
        className="mb-6 flex-1 resize-none font-mono text-base leading-relaxed overflow-y-auto border-muted-foreground/50"
      />
    );
  },
);

/**
 * Textarea의 현재 커서 위치에 텍스트를 삽입하고 포커스를 유지
 */
export const insertTextAtCursor = (
  textarea: HTMLTextAreaElement,
  text: string,
  currentValue: string,
  onChange: (val: string) => void,
) => {
  const { selectionStart, selectionEnd } = textarea;

  const nextValue =
    currentValue.substring(0, selectionStart) +
    text +
    currentValue.substring(selectionEnd);

  onChange(nextValue);

  // DOM 업데이트 후 커서 위치 조정
  setTimeout(() => {
    textarea.focus();
    const nextPos = selectionStart + text.length;
    textarea.setSelectionRange(nextPos, nextPos);
  }, 0);
};

/**
 * 텍스트 영역에서 Tab 키 입력 시 공백 2개를 삽입하는 핸들러
 */
const handleTabSupport = (
  e: KeyboardEvent<HTMLTextAreaElement>,
  value: string,
  onChange: (val: string) => void,
) => {
  if (e.key !== 'Tab') return;

  e.preventDefault();
  const { selectionStart, selectionEnd } = e.currentTarget;

  const nextValue =
    value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);

  onChange(nextValue);

  // 커서 위치 조정을 위해 다음 이벤트 루프에서 실행
  setTimeout(() => {
    if (e.currentTarget) {
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
        selectionStart + 2;
    }
  }, 0);
};

ContentEditor.displayName = 'ContentEditor';
export default ContentEditor;
