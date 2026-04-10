const PostDetailSkeleton = () => {
  return (
    <div className="space-y-16 animate-pulse">
      <header className="mb-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="h-10 w-2/3 bg-slate-200/50 dark:bg-slate-700/50 rounded-md" />
          <div className="h-5 w-24 bg-slate-200/30 dark:bg-slate-700/30 rounded shrink-0" />
        </div>

        {/* 하단 메타 정보 */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="h-5 w-20 bg-slate-200/30 dark:bg-slate-700/30 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-slate-200/40 dark:bg-slate-700/40 rounded-full" />
            <div className="h-8 w-8 bg-slate-200/40 dark:bg-slate-700/40 rounded-full" />
          </div>
        </div>
      </header>

      <div className="h-px w-full bg-slate-200/40 dark:bg-slate-700/40" />

      {/* 본문 영역 스켈레톤 */}
      <section className="space-y-4">
        <div className="h-4 w-full bg-slate-200/30 dark:bg-slate-700/30 rounded" />
        <div className="h-4 w-[95%] bg-slate-200/30 dark:bg-slate-700/30 rounded" />
        <div className="h-4 w-[90%] bg-slate-200/30 dark:bg-slate-700/30 rounded" />
        <div className="h-4 w-[98%] bg-slate-200/30 dark:bg-slate-700/30 rounded" />
        <div className="h-4 w-2/3 bg-slate-200/30 dark:bg-slate-700/30 rounded" />

        <div className="pt-8 space-y-4">
          <div className="h-6 w-1/4 bg-slate-200/40 dark:bg-slate-700/40 rounded" />
          <div className="h-4 w-full bg-slate-200/30 dark:bg-slate-700/30 rounded" />
          <div className="h-4 w-[92%] bg-slate-200/30 dark:bg-slate-700/30 rounded" />
        </div>
      </section>
    </div>
  );
};

export default PostDetailSkeleton;
