"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight"; // 고속
import rehypePrettyCode from "rehype-pretty-code";
import { cn } from "@/utils/styles";
import { PluggableList } from "unified";

import "highlight.js/styles/github-dark.css";

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
  const rehypePlugins: PluggableList = isEditor
    ? [rehypeHighlight]
    : [[rehypePrettyCode, { theme: "github-dark", keepBackground: true }]];

  return (
    <div
      className={cn(
        "prose prose-slate max-w-none dark:prose-invert",
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
