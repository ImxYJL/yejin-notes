import { cn } from "@/utils/styles";

type MarkdownViewerProps = {
  htmlContent: string;
  className?: string;
};

const MarkdownViewer = ({ htmlContent, className }: MarkdownViewerProps) => {
  return (
    <div
      className={cn(
        "prose max-w-none dark:prose-invert",
        "[&_pre]:p-5 [&_pre]:rounded-main",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownViewer;
