"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Lock, Unlock, Tag, SaveAll } from "lucide-react";
import { Button } from "@/components/common";
import { CategorySlug, EditorMode } from "@/types/blog";
import { cn } from "@/utils/styles";
import CategorySelector from "./CategorySelector";

type EditorToolbarProps = {
  mode: EditorMode;
  isPrivate: boolean;
  isPending: boolean;
  categorySlug: CategorySlug;
  onTogglePrivate: () => void;
  onSelect: (slug: CategorySlug) => void;
  onSave: () => void;
  onDraftSave: () => void;
};

const EditorToolbar = ({
  mode,
  isPrivate,
  isPending,
  categorySlug,
  onTogglePrivate,
  onDraftSave,
  onSelect,
  onSave,
}: EditorToolbarProps) => {
  const router = useRouter();

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
            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-medium",
            "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800",
          )}
        >
          {isPrivate ? <Lock size={14} /> : <Unlock size={14} />}
          <span>{isPrivate ? "비공개" : "공개"}</span>
        </button>

        <CategorySelector categorySlug={categorySlug} onSelect={onSelect} />
      </div>

      <div className="flex items-center gap-4">
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
