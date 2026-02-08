import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/styles";

const INPUT_VARIANT = {
  outline: "border border-border bg-background focus:border-accent-primary",
  ghost: "border-none bg-transparent",
} as const;

const FONT_SIZE = {
  base: "text-base",
  xl: "text-xl font-bold",
  "4xl": "text-4xl font-black tracking-tight leading-tight",
} as const;

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: keyof typeof INPUT_VARIANT;
  fontSize?: keyof typeof FONT_SIZE;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "outline", fontSize = "base", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-main px-4 py-2 outline-none placeholder:text-muted-foreground",
          "base-focus base-disabled base-transition",
          INPUT_VARIANT[variant],
          FONT_SIZE[fontSize],
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
export default Input;
