"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/utils/styles";

import "highlight.js/styles/base16/brush-trees-dark.css";

type MarkdownPreviewProps = {
  content: string;
  className?: string;
};

const MarkdownPreview = ({ content, className }: MarkdownPreviewProps) => {
  return (
    <div className={cn("prose max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // prose의 기본 배경과 여백 제거 (전역과 무관 - 코드 블럭 내 설정)
          pre: ({ children }) => (
            <pre className="bg-transparent p-0 m-0 border-none">{children}</pre>
          ),

          code: ({ children, className: codeClassName }) => {
            const isCodeBlock = codeClassName?.includes("language-");

            if (isCodeBlock) {
              return (
                <code
                  className={cn(
                    "block p-5 rounded-main leading-relaxed text-sm bg-muted/30",
                    codeClassName,
                  )}
                >
                  {children}
                </code>
              );
            }

            return <code>{children}</code>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
