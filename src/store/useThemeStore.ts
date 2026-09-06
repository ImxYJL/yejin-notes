import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeName = 'cream' | 'forest' | 'ocean';

type ThemeState = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

const applyTheme = (theme: ThemeName) => {
  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'forest',
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);

export default useThemeStore;
