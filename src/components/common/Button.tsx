import { cn } from "@/utils/styles";
import { ButtonHTMLAttributes, ReactNode } from "react";

const BUTTON_VARIANT = {
  primary:
    "bg-accent-primary text-white shadow-sm hover:opacity-90 active:scale-[0.98]",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-gray-50",
  ghost: "text-muted-foreground hover:bg-gray-100 hover:text-foreground",
} as const;

const BUTTON_SIZE = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof BUTTON_VARIANT;
  size?: keyof typeof BUTTON_SIZE;
  icon?: ReactNode;
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  icon,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-main font-medium whitespace-nowrap",
        "base-focus base-disabled base-transition", // 전역 레이어 적용
        BUTTON_VARIANT[variant],
        BUTTON_SIZE[size],
        className,
      )}
      {...props}
    >
      {icon && <span className="mr-2 shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
