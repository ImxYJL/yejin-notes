"use client";

import { useToastStore } from "@/store/useToastStore";
import { cn } from "@/utils/styles";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const ICON = {
  success: <CheckCircle2 size={18} className="text-[#31748f]" />,
  error: <AlertCircle size={18} className="text-[#eb6f92]" />,
  info: <Info size={18} className="text-[#907aa9]" />,
};

const Toast = () => {
  const { message, isVisible, type, hideToast } = useToastStore();

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-toast animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-3 shadow-xl border border-border bg-background rounded-main min-w-[300px]",
        )}
      >
        <span className="shrink-0">{ICON[type]}</span>
        <p className="text-sm font-medium text-foreground flex-1">{message}</p>
        <button
          onClick={hideToast}
          className="p-1 hover:bg-muted rounded-full base-transition text-muted-foreground"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
