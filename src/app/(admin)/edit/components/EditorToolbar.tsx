'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Lock, Unlock, Tag, SaveAll } from 'lucide-react';
import { Button } from '@/components/common';
import { CategorySlug, EditorMode } from '@/types/blog';
import { cn } from '@/utils/styles';
import CategorySelector from './CategorySelector';
import { useState } from 'react';
import DraftListDrawer from './DraftListDrawer';

type EditorToolbarProps = {
  mode: EditorMode;
  isPrivate: boolean;
  isPending: boolean;
  categorySlug: CategorySlug;
  onTogglePrivate: () => void;
  onCategorySelect: (slug: CategorySlug) => void;
  onDraftSelect: (id: string) => void;
  onSave: () => void;
  onDraftSave: () => void;
};

const EditorToolbar = ({
  onDraftSelect,
  isPrivate,
  isPending,
  categorySlug,
  onTogglePrivate,
  onDraftSave,
  onCategorySelect,
  onSave,
}: EditorToolbarProps) => {
  const router = useRouter();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="flex justify-between items-center pr-6 pt-6 pb-2 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          icon={<ArrowLeft size={20} />}
          className="hover:bg-accent-primary/10"
        >
          나가기
        </Button>

        {/* <Divider vertical className="h-4" /> */}

        {/* 비밀글 토글 */}
        <button
          onClick={onTogglePrivate}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-medium',
            'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800',
          )}
        >
          {isPrivate ? <Lock size={14} /> : <Unlock size={14} />}
          <span>{isPrivate ? '비공개' : '공개'}</span>
        </button>

        <CategorySelector categorySlug={categorySlug} onSelect={onCategorySelect} />
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          // className="text-xs font-bold text-muted-foreground hover:text-accent-primary underline underline-offset-4 base-transition mr-2"
        >
          임시저장 목록 열기
        </Button>

        <DraftListDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSelect={onDraftSelect}
        />

        <Button
          variant="outline"
          size="md"
          onClick={onDraftSave}
          disabled={isPending}
          className="font-semibold text-muted-foreground border-muted-foreground"
        >
          임시저장
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onSave}
          disabled={isPending}
          icon={<Save size={16} />}
          className="font-semibold"
        >
          저장
        </Button>
      </div>
    </header>
  );
};

export default EditorToolbar;
