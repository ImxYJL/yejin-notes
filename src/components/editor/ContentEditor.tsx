import { memo, ChangeEvent, KeyboardEvent } from "react";
import { Textarea } from "../common";

type ContentEditorProps = {
  value: string;
  onChange: (val: string) => void;
};

const ContentEditor = memo(({ value, onChange }: ContentEditorProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.currentTarget;
      const nextValue =
        value.substring(0, selectionStart) +
        "  " +
        value.substring(selectionEnd);

      onChange(nextValue);

      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
          selectionStart + 2;
      }, 0);
    }
  };

  return (
    <Textarea
      variant="outline"
      placeholder="여기에 입력해주세요"
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        onChange(e.target.value)
      }
      onKeyDown={handleKeyDown}
      className="flex-1 resize-none font-mono text-base leading-relaxed overflow-y-auto"
    />
  );
});

ContentEditor.displayName = "ContentEditor";
export default ContentEditor;
