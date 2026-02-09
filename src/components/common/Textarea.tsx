import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/styles";

const TEXTAREA_VARIANT = {
  outline:
    "border border-border bg-background focus:border-accent-primary focus:ring-0",
  ghost: "border-none bg-transparent",
} as const;

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: keyof typeof TEXTAREA_VARIANT;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "outline", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-[200px] rounded-main px-4 py-6 text-base leading-none outline-none placeholder:text-muted-foreground",
          "base-disabled base-transition",
          TEXTAREA_VARIANT[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
export default Textarea;
