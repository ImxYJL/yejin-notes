const LoadingOverlay = () => (
  <div className="fixed inset-0 z-overlay flex items-center justify-center bg-transparent/10 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-2.5 p-5">
      {/* 점 세 개 애니메이션 */}
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2.5 h-2.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2.5 h-2.5 bg-slate-200 rounded-full animate-bounce"></div>
      </div>
    </div>
  </div>
);

export default LoadingOverlay;
