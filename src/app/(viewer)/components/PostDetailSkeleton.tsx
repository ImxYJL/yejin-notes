const PostDetailSkeleton = () => {
  return (
    <div className="space-y-16 animate-pulse">
      <header className="mb-4 space-y-6">
        {/* 제목 스켈레톤 */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="h-10 w-2/3 bg-muted rounded-md" />
          <div className="h-5 w-24 bg-muted/60 rounded shrink-0" />
        </div>

        {/* 하단 메타 정보 (카테고리, 버튼들) */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="h-5 w-20 bg-muted/60 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-muted/60 rounded-full" />
            <div className="h-8 w-8 bg-muted/60 rounded-full" />
          </div>
        </div>
      </header>

      <div className="h-[1px] w-full bg-muted/30" />

      {/* 본문(Markdown) 영역 스켈레톤 */}
      <section className="space-y-4">
        <div className="h-4 w-full bg-muted/40 rounded" />
        <div className="h-4 w-[95%] bg-muted/40 rounded" />
        <div className="h-4 w-[90%] bg-muted/40 rounded" />
        <div className="h-4 w-[98%] bg-muted/40 rounded" />
        <div className="h-4 w-2/3 bg-muted/40 rounded" />

        <div className="pt-8 space-y-4">
          <div className="h-6 w-1/4 bg-muted/50 rounded" /> {/* 중제목 느낌 */}
          <div className="h-4 w-full bg-muted/40 rounded" />
          <div className="h-4 w-[92%] bg-muted/40 rounded" />
        </div>
      </section>
    </div>
  );
};

export default PostDetailSkeleton;
