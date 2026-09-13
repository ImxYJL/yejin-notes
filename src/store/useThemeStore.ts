import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeName, THEME_STORAGE_KEY } from '@/constants/theme';

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
      name: THEME_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme);
      },
    },
  ),
);

export default useThemeStore;
