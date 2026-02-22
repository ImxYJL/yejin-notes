import { create } from "zustand";

type ToastType = "success" | "error" | "info";

type ToastState = {
  message: string;
  isVisible: boolean;
  type: ToastType;
  timeoutId: NodeJS.Timeout | null;
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
