import { ChangeEvent, KeyboardEvent, memo } from "react";
import { Textarea } from "../common";

type ContentEditorProps = {
  value: string;
  onChange: (val: string) => void;
  onScroll: () => void;
  ref?: React.RefObject<HTMLTextAreaElement | null>;
};

const ContentEditor = memo(
  ({ value, onChange, onScroll, ref }: ContentEditorProps) => {
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
        onKeyDown={handleKeyDown}
        ref={ref}
        className="mb-6 flex-1 resize-none font-mono text-base leading-relaxed overflow-y-auto border-muted-foreground/50"
      />
    );
  },
);

/**
 * 텍스트 영역에서 Tab 키 입력 시 공백 2개를 삽입하는 핸들러
 */
const handleTabSupport = (
  e: KeyboardEvent<HTMLTextAreaElement>,
  value: string,
  onChange: (val: string) => void,
) => {
  if (e.key !== "Tab") return;

  e.preventDefault();
  const { selectionStart, selectionEnd } = e.currentTarget;

  const nextValue =
    value.substring(0, selectionStart) + "  " + value.substring(selectionEnd);

  onChange(nextValue);

  // 커서 위치 조정을 위해 다음 이벤트 루프에서 실행
  setTimeout(() => {
    if (e.currentTarget) {
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
        selectionStart + 2;
    }
  }, 0);
};

ContentEditor.displayName = "ContentEditor";
export default ContentEditor;
