import { cn } from "@/utils/styles";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "outline" | "ghost" | "primary";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  icon,
  disabled,
  className,
  ...props
}: ButtonProps) => {
  const variants = {
    primary:
      "bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-[0.98]",
    outline:
      "border border-border bg-transparent text-foreground hover:bg-muted",
    ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap transition-all duration-200",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-50 disabled:shadow-none",
        variants[variant],
        sizes[size],
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
