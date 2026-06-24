'use client';

import { Portal } from '@/components/common';
import useDeleteDraft from '@/queries/useDeleteDraft';
import useDrafts from '@/queries/useDrafts';
import { formatDate } from '@/utils/date';
import { cn } from '@/utils/styles';
import { X, Loader2, Trash2 } from 'lucide-react';

type DraftListDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
};

const DraftListDrawer = ({ isOpen, onClose, onSelect }: DraftListDrawerProps) => {
  const { data: drafts, isLoading, isError } = useDrafts(isOpen);
  const { mutate: deleteDraft, isPending: isDeletePending } = useDeleteDraft();

  return (
    <Portal>
      {/* 1. 오버레이 */}
      <div
        className={cn(
          'fixed inset-0 bg-black/10 backdrop-blur-[1px] transition-opacity duration-300 z-overlay',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
          isDeletePending && 'pointer-events-none',
        )}
        onClick={onClose}
      />

      {/* 2. 드로어 본체 */}
      <aside
        className={cn(
          'fixed top-0 right-0 h-full w-[360px] bg-white shadow-2xl z-drawer isolation-isolate',
          'transition-transform duration-300 ease-in-out border-l border-black/[0.03]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex flex-col h-full p-6">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-[#575279]">임시저장 목록</h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-black/5 rounded-full base-transition text-muted-foreground"
            >
              <X size={20} />
            </button>
          </div>

          <ul className="flex-1 overflow-y-auto divide-y divide-gray-300">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-muted-foreground">
                <Loader2 className="animate-spin" size={24} />
                <p className="text-sm">초안을 불러오는 중...</p>
              </div>
            ) : isError ? (
              <p className="text-center py-10 text-rose-400 text-sm">
                목록을 불러오지 못했습니다.
              </p>
            ) : drafts?.length === 0 ? (
              <p className="text-center py-20 text-muted-foreground text-sm font-medium">
                보관된 초안이 없습니다. 📭
              </p>
            ) : (
              drafts?.map((draft) => (
                <li key={draft.id} className="group relative">
                  <button
                    onClick={() => {
                      onSelect(draft.id);
                      onClose();
                    }}
                    className={cn(
                      'w-full text-left p-4 border-transparent',
                      'bg-white group base-transition',
                    )}
                  >
                    <div className="flex-1 min-w-0 pr-8">
                      <h3 className="text-sm font-semibold text-[#575279] truncate group-hover:text-accent-primary">
                        {draft.title || '제목 없는 글'}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-1.5 font-medium uppercase tracking-wider">
                        {formatDate(draft.createdAt)}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDraft(draft.id);
                    }}
                    className={cn(
                      'absolute right-4 top-1/2 -translate-y-1/2 p-2',
                      'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                      'text-gray-400 hover:text-red-500',
                    )}
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </aside>
    </Portal>
  );
};

export default DraftListDrawer;
