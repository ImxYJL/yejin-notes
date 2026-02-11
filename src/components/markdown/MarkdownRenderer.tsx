"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn, getRehypePlugins } from "@/utils/styles";
import { useMemo, useState } from "react";
import { CODE_VIEWER_THEME } from "@/constants/theme";

import "highlight.js/styles/base16/brush-trees-dark.css";

type MarkdownRendererProps = {
  content: string;
  className?: string;
  isEditor?: boolean;
};

const MarkdownRenderer = ({
  content,
  className,
  isEditor = false,
}: MarkdownRendererProps) => {
  // 나중에 전역 상태(Zustand 등)나 드롭다운 상태를 여기서 읽어옵니다.
  const [currentCodeTheme] = useState(CODE_VIEWER_THEME.light);

  const rehypePlugins = useMemo(
    () => getRehypePlugins(isEditor, currentCodeTheme),
    [isEditor, currentCodeTheme],
  );

  return (
    <div
      className={cn(
        "prose max-w-none dark:prose-invert",
        /* 텁텁한 테두리 & 배경 리셋 */
        "[&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:border-none [&_pre]:m-0",
        "[&_code]:bg-transparent [&_code]:p-0 [&_code]:border-none",
        /* 코드 블록 스타일 */
        "[&_pre_code]:block [&_pre_code]:p-5 [&_pre_code]:rounded-main",
        "[&_pre_code]:bg-muted/30 [&_pre_code]:leading-relaxed [&_pre_code]:text-sm",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={rehypePlugins}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
