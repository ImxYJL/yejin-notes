import { create } from "zustand";

type ToastType = "success" | "error" | "info";

type ToastState = {
  message: string;
  isVisible: boolean;
  type: ToastType;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
};

const TOAST_TIMER = 3000;

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  isVisible: false,
  type: "info",

  showToast: (message, type = "info") => {
    set({ message, isVisible: true, type });

    setTimeout(() => {
      set({ isVisible: false });
    }, TOAST_TIMER);
  },
  hideToast: () => set({ isVisible: false }),
}));
