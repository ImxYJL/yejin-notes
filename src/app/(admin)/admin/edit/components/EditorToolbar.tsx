'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { cn } from '@/utils/styles';
import { useState } from 'react';
import DraftListDrawer from './DraftListDrawer';

type EditorToolbarProps = {
  isPending: boolean;
  showPreview: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
  onDraftSave: () => void;
  onDraftSelect: (id: string) => void;
};

const EditorToolbar = ({
  isPending,
  showPreview,
  onTogglePreview,
  onDraftSelect,
  onSave,
  onDraftSave,
}: EditorToolbarProps) => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header
      className="shrink-0 sticky top-0 z-header bg-background/90 backdrop-blur-md flex items-center justify-between px-8 py-2"
      style={{ borderBottom: '1.25px solid color-mix(in srgb, var(--color-accent), transparent 40%)' }}
    >
      <div className="flex items-center gap-1">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground base-transition px-2 py-2 rounded-main hover:bg-muted/60"
        >
          <ArrowLeft size={16} />
          나가기
        </button>

        <div className="w-px h-4 bg-muted-foreground/20 mx-1" />

        <button
          onClick={onTogglePreview}
          className={cn(
            'flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-main border base-transition',
            showPreview
              ? 'border-accent-primary/50 text-accent-primary bg-accent-primary/8'
              : 'border-muted-foreground/20 text-muted-foreground hover:text-foreground hover:border-muted-foreground/40',
          )}
        >
          <Eye size={14} />
          미리보기
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          className="text-[13px] text-muted-foreground/70 hover:text-muted-foreground base-transition px-2 py-2"
        >
          임시저장 목록
        </button>

        <DraftListDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSelect={onDraftSelect}
        />

        <button
          onClick={onDraftSave}
          disabled={isPending}
          className="text-[13px] px-3.5 py-1.5 rounded-main border border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/60 hover:text-foreground base-transition disabled:opacity-40"
        >
          임시저장
        </button>

        <button
          onClick={onSave}
          disabled={isPending}
          className="flex items-center gap-1.5 text-[13px] px-4 py-1.5 rounded-main bg-accent-primary text-white font-medium hover:opacity-90 base-transition disabled:opacity-40"
        >
          <Save size={13} style={{ color: 'white' }} />
          저장
        </button>
      </div>
    </header>
  );
};

export default EditorToolbar;
