import { ChangeEvent } from 'react';
import { Input } from '../common';

type TitleInputProps = {
  value: string;
  onChange: (val: string) => void;
};

const TitleInput = ({ value, onChange }: TitleInputProps) => (
  <Input
    name="title"
    variant="ghost"
    fontSize="3xl"
    placeholder="제목을 입력하세요"
    value={value}
    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    className="p-2 border-none font-bold placeholder:text-muted-foreground/40"
  />
);

export default TitleInput;
