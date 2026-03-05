import { Callout } from "@/components/common";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  content: string;
};

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        blockquote: Callout,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
