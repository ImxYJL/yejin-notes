import { ChangeEvent } from 'react';

type TitleInputProps = {
  value: string;
  onChange: (val: string) => void;
};

const TitleInput = ({ value, onChange }: TitleInputProps) => (
  <input
    name="title"
    placeholder="제목을 입력하세요"
    value={value}
    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    className="w-full bg-transparent border-none outline-none text-[1.75rem] font-semibold leading-tight tracking-tight mb-8 placeholder:text-muted-foreground/25"
  />
);

export default TitleInput;
