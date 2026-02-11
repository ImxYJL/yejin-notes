import { cn } from "@/utils/styles";

type DividerProps = {
  direction?: "vertical" | "horizontal";
  className?: string;
  style?: React.CSSProperties;
};

const Divider = ({
  direction = "vertical",
  className,
  style,
}: DividerProps) => {
  return (
    <div
      style={style}
      className={cn(
        "bg-muted-foreground/20 shrink-0",
        direction === "vertical" ? "w-[1px] h-full" : "h-[1px] w-full",
        className,
      )}
    />
  );
};

export default Divider;
