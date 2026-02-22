const PostSkeleton = () => (
  <div className="py-6 space-y-3 animate-pulse">
    <div className="h-7 bg-muted/50 rounded-main w-3/4" /> {/* 제목 */}
    <div className="space-y-2">
      <div className="h-4 bg-muted/30 rounded-main w-full" />{" "}
      {/* 본문 요약 line 1 */}
      <div className="h-4 bg-muted/30 rounded-main w-5/6" />{" "}
      {/* 본문 요약 line 2 */}
    </div>
    <div className="h-4 bg-muted/20 rounded-main w-24" /> {/* 날짜/태그 */}
  </div>
);

export default PostSkeleton;
