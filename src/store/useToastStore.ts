import { create } from "zustand";

type ToastType = "success" | "error" | "info";

type ToastState = {
  message: string;
  isVisible: boolean;
  type: ToastType;
  timeoutId: NodeJS.Timeout | null; // 💡 타이머 ID 저장소 추가
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
};

const TOAST_TIMER = 3000;

export const useToastStore = create<ToastState>((set, get) => ({
  message: "",
  isVisible: false,
  type: "info",
  timeoutId: null,

  showToast: (message, type = "info") => {
    // 1. 💡 이미 실행 중인 타이머가 있다면 취소 (중복 방지)
    const currentTimeout = get().timeoutId;
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }

    const id = setTimeout(() => {
      set({ isVisible: false, timeoutId: null });
    }, TOAST_TIMER);

    set({
      message,
      isVisible: true,
      type,
      timeoutId: id,
    });
  },

  hideToast: () => {
    const currentTimeout = get().timeoutId;
    if (currentTimeout) clearTimeout(currentTimeout);

    set({ isVisible: false, timeoutId: null });
  },
}));
