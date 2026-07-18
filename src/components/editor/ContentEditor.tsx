import { ChangeEvent, KeyboardEvent } from 'react';
import { Textarea } from '../common';

type Props = {
  value: string;
  onChange: (val: string) => void;
  onScroll: () => void;
  onImgPaste: (file: File) => void;
  ref?: React.RefObject<HTMLTextAreaElement | null>;
};

const ContentEditor = ({ value, onChange, onScroll, onImgPaste, ref }: Props) => {
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (handleImagePaste(e, onImgPaste)) return;

    await handleCodeBlockPaste(e, value, onChange);
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
};

/** [이미지 붙여넣기 처리]
 * 클립보드 아이템이 이미지면 처리 후 true 반환, 아니면 false 반환 */
const handleImagePaste = (
  e: React.ClipboardEvent<HTMLTextAreaElement>,
  onImgPaste: (file: File) => void,
): boolean => {
  const item = e.clipboardData.items[0];
  if (!item?.type.startsWith('image/')) return false;

  const file = item.getAsFile();
  if (file) {
    e.preventDefault();
    onImgPaste(file);
  }
  return true;
};

/** [코드 블럭에서 코드 포매팅]
 * 커서가 코드 블럭 안에 있으면 붙여넣기 텍스트를 포맷 후 삽입 */
const handleCodeBlockPaste = async (
  e: React.ClipboardEvent<HTMLTextAreaElement>,
  value: string,
  onChange: (val: string) => void,
) => {
  const textarea = e.currentTarget;
  // async 이후 커서가 이동할 수 있으므로 미리 캡처
  const selectionStart = textarea.selectionStart;
  const selectionEnd = textarea.selectionEnd;

  const { isInsideCodeBlock, language } = detectCodeBlock(
    value.substring(0, selectionStart),
  );
  if (!isInsideCodeBlock) return;

  const pastedText = e.clipboardData.getData('text');
  if (!pastedText) return;

  e.preventDefault();
  const formatted = await formatCode(pastedText, language);
  const nextValue =
    value.substring(0, selectionStart) + formatted + value.substring(selectionEnd);
  onChange(nextValue);

  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(
      selectionStart + formatted.length,
      selectionStart + formatted.length,
    );
  }, 0);
};

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
 * 커서 앞 텍스트에서 ``` 펜스 개수를 세어 코드 블럭 안인지 판단.
 * 열린 펜스가 홀수개면 커서가 코드 블럭 안에 있는 것으로 간주
 */
const detectCodeBlock = (
  textBeforeCursor: string,
): { isInsideCodeBlock: boolean; language: string } => {
  const fenceRegex = /^```(\w*)/gm;
  let match;
  let isInsideCodeBlock = false;
  let language = '';

  while ((match = fenceRegex.exec(textBeforeCursor)) !== null) {
    if (!isInsideCodeBlock) {
      isInsideCodeBlock = true;
      language = match[1] ?? '';
    } else {
      isInsideCodeBlock = false;
      language = '';
    }
  }

  return { isInsideCodeBlock, language };
};

/** 마크다운 코드 펜스 언어 식별자 → prettier parser 이름 */
const PARSER_MAP: Record<string, string> = {
  js: 'babel',
  javascript: 'babel',
  jsx: 'babel',
  ts: 'typescript',
  typescript: 'typescript',
  tsx: 'typescript',
  css: 'css',
  scss: 'css',
  less: 'css',
  html: 'html',
  json: 'json',
};

/**
 * prettier standalone은 파서와 플러그인을 분리해서 받음
 * babel/typescript는 AST 공유를 위해 estree 플러그인이 함께 필요
 */
const loadPlugins = async (parser: string) => {
  switch (parser) {
    case 'babel':
    case 'json': {
      const [{ default: babel }, { default: estree }] = await Promise.all([
        import('prettier/plugins/babel'),
        import('prettier/plugins/estree'),
      ]);
      return [babel, estree];
    }
    case 'typescript': {
      const [{ default: typescript }, { default: estree }] = await Promise.all([
        import('prettier/plugins/typescript'),
        import('prettier/plugins/estree'),
      ]);
      return [typescript, estree];
    }
    case 'css': {
      const { default: postcss } = await import('prettier/plugins/postcss');
      return [postcss];
    }
    case 'html': {
      const { default: html } = await import('prettier/plugins/html');
      return [html];
    }
    default:
      return null;
  }
};

/** prettier 미지원 언어의 fallback: 공통 최소 들여쓰기 제거 */
const dedent = (code: string): string => {
  const lines = code.split('\n');
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  if (nonEmptyLines.length === 0) return code;

  const minIndent = Math.min(
    ...nonEmptyLines.map((line) => line.match(/^(\s*)/)?.[1].length ?? 0),
  );

  if (minIndent === 0) return code;
  return lines.map((line) => line.slice(minIndent)).join('\n');
};

/**
 * 언어에 맞는 prettier 파서로 포맷.
 * PARSER_MAP에 없는 언어(python, go 등)는 dedent만 적용.
 * prettier 포맷 실패 시에도 dedent로 fallback.
 */
const formatCode = async (code: string, language: string): Promise<string> => {
  const parser = PARSER_MAP[language.toLowerCase()];
  if (!parser) return dedent(code);

  try {
    const [prettier, plugins] = await Promise.all([
      import('prettier/standalone'),
      loadPlugins(parser),
    ]);
    if (!plugins) return dedent(code);

    const formatted = await prettier.format(code, { parser, plugins, tabWidth: 2 });
    return formatted.trimEnd(); // prettier는 항상 trailing newline을 추가하므로 제거
  } catch {
    return dedent(code);
  }
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

export default ContentEditor;
