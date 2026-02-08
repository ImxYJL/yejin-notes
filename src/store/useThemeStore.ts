import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeName = "rainbow" | "ocean" | "forest";

type ThemeState = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "rainbow",
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== "undefined") {
          document.documentElement.setAttribute("data-theme", theme);
        }
      },
    }),
    { name: "theme-storage" },
  ),
);

export default useThemeStore;
