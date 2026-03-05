import { cn } from "@/utils/styles";

type MarkdownViewerProps = {
  contentNode: React.ReactNode;
  className?: string;
};

const MarkdownViewer = ({ contentNode, className }: MarkdownViewerProps) => {
  return (
    <div
      className={cn(
        "prose max-w-none dark:prose-invert",
        "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-10",
        "[&_pre]:p-5 [&_pre]:rounded-main",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
        className,
      )}
    >
      {contentNode}
    </div>
  );
};

export default MarkdownViewer;
