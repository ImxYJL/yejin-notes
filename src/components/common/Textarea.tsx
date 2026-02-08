import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/styles";

const TEXTAREA_VARIANT = {
  outline: "border border-border bg-background focus:border-accent-primary",
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
          "w-full rounded-main p-4 text-base leading-relaxed outline-none placeholder:text-muted-foreground",
          "base-focus base-disabled base-transition",
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
