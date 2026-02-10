import { cn } from "@/utils/styles";

type VerticalDividerProps = {
  className?: string;
  style?: React.CSSProperties;
};

const VerticalDivider = ({ className, style }: VerticalDividerProps) => {
  return (
    <div
      style={style}
      className={cn(
        "w-[1px] bg-muted-foreground/20 shrink-0",
        "h-full",
        className,
      )}
    />
  );
};

export default VerticalDivider;
