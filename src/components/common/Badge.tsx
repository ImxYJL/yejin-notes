import { cn } from "@/utils/styles";

type Props = {
  label: string;
  isSelected: boolean;
  className?: string;
};

const Badge = ({ label, isSelected, className }: Props) => (
  <span
    className={cn(
      "px-3 py-1 rounded-full text-[11px] whitespace-nowrap transition-all border",
      isSelected
        ? "bg-accent-primary text-white border-accent-primary"
        : "bg-muted text-muted-foreground border-transparent hover:border-border",
      className,
    )}
  >
    {label}
  </span>
);

export default Badge;
