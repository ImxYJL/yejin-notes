import { InputHTMLAttributes } from "react";
import { cn } from "@/utils/styles";

const INPUT_VARIANT = {
  outline: "border border-border bg-background focus:border-accent-primary",
  ghost: "border-none bg-transparent",
} as const;

const FONT_SIZE = {
  base: "text-base",
  xl: "text-xl font-bold",
  "3xl": "text-3xl font-bold tracking-tight leading-snug",
  "4xl": "text-4xl font-black tracking-tight leading-tight",
} as const;

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: keyof typeof INPUT_VARIANT;
  fontSize?: keyof typeof FONT_SIZE;
  ref?: React.RefObject<HTMLInputElement | null>;
};

const Input = ({
  className,
  variant = "outline",
  fontSize = "base",
  ref,
  ...props
}: InputProps) => (
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

export default Input;
