import { cn } from '@/utils/styles';

// TODO: 수직 / 수평도 자주 쓰여서 별도 타입 분리하면 좋을 듯
type DividerProps = {
  direction?: 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
};

const Divider = ({ direction = 'vertical', className, style }: DividerProps) => {
  return (
    <div
      style={style}
      className={cn(
        'bg-muted-foreground/20 shrink-0',
        direction === 'vertical' ? 'w-px h-full' : 'h-px w-full',
        className,
      )}
    />
  );
};

export default Divider;
