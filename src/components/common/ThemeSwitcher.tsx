'use client';

import useThemeStore from '@/store/useThemeStore';
import { BLOG_THEMES } from '@/constants/theme';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex gap-2">
      {BLOG_THEMES.map(({ name, color }) => {
        const isSelected = theme === name;
        return (
          <button
            key={name}
            onClick={() => setTheme(name)}
            aria-label={name}
            className="w-4 h-4 rounded-full base-transition"
            style={{
              backgroundColor: isSelected ? color : 'transparent',
              border: `1.25px solid ${color}`,
              opacity: isSelected ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${color}40`;
                (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.opacity = '0.6';
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
