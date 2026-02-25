"use client";

import { useToastStore } from "@/store/useToastStore";
import { cn } from "@/utils/styles";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const ICON_MAP = {
  success: <CheckCircle2 size={18} color="#31748f" />,
  error: <AlertCircle size={18} color="#eb6f92" />,
  info: <Info size={18} color="#907aa9" />,
};

const toastStyles = {
  success: "border-l-4 border-[#31748f] bg-[#f2f9f9] text-[#31748f]",
  error: "border-l-4 border-[#eb6f92] bg-[#fff5f5] text-[#eb6f92]",
  info: "border-l-4 border-[#907aa9] bg-[#f5f3f7] text-[#907aa9]",
};

const Toast = () => {
  const { message, isVisible, type, hideToast } = useToastStore();

  if (!isVisible) return null;

  return (
    <div className="isolation-isolate fixed top-20 left-1/2 -translate-x-1/2 z-toast animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-3 shadow-xl rounded-main min-w-[300px]",
          toastStyles[type],
        )}
      >
        <span className="shrink-0">{ICON_MAP[type]}</span>
        <p className="text-sm font-bold flex-1 text-inherit">{message}</p>
        <button
          onClick={hideToast}
          className="p-1 hover:bg-black/5 rounded-full base-transition text-muted-foreground"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
