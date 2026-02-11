"use client";

import { useEffect, useState } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { cn } from "@/utils/styles";

import rosePineDawn from "shiki/themes/rose-pine-dawn.mjs";

type MarkdownViewerProps = {
  content: string;
  className?: string;
};

const MarkdownViewer = ({ content, className }: MarkdownViewerProps) => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const processMarkdown = async () => {
      const result = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypePrettyCode, {
          theme: rosePineDawn,
          keepBackground: true,
        })
        .use(rehypeStringify)
        .process(content);

      setHtmlContent(result.toString());
    };
    processMarkdown();
  }, [content]);

  return (
    <div
      className={cn(
        "prose max-w-none dark:prose-invert",
        "[&_pre]:p-5 [&_pre]:rounded-main",
        // 코드 블록 내부 code 스타일만 리셋
        "[&_pre_code]:bg-transparent! [&_pre_code]:p-0! [&_pre_code]:text-inherit!",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownViewer;
