import { memo, ChangeEvent } from "react";
import { Input } from "../common";

type TitleInputProps = {
  value: string;
  onChange: (val: string) => void;
};

const TitleInput = memo(({ value, onChange }: TitleInputProps) => {
  return (
    <Input
      name="title"
      variant="ghost"
      fontSize="4xl"
      placeholder="제목을 입력하세요"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      className="px-0 border-b border-border rounded-none focus:border-accent-primary"
    />
  );
});

TitleInput.displayName = "TitleInput";
export default TitleInput;
