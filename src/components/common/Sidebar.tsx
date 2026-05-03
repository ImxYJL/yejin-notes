'use client';

import Link from 'next/link';
import Button from './Button';
import { Github, Mail, X, Menu, Lock } from 'lucide-react';
import { cn } from '@/utils/styles';
import useLayoutStore from '@/store/useLayoutStore';
import { CATEGORY_MAP } from '@/constants/blog';
import useDevice from '@/hooks/useDevice';
import { Category, CategorySlug } from '@/types/blog';

type CategoryWithHref = Category & { href: string };

type Props = {
  categories: CategoryWithHref[];
  selectedSlug: CategorySlug | null;
};

const Sidebar = ({ categories, selectedSlug }: Props) => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useLayoutStore();
  const { isMobile } = useDevice();

  const handleCategoryClick = () => {
    if (isMobile) closeSidebar();
  };

  return (
    <>
      {/* 1. 모바일용: 상단 가로 바 (md 미만에서만 노출) */}
      {!isSidebarOpen && (
        <header className="fixed top-0 left-0 right-0 h-12 z-sidebar-btn bg-background/80 backdrop-blur-md flex items-center px-4 animate-in fade-in slide-in-from-top-2 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="hover:bg-accent-primary/10 text-accent-primary"
          >
            <Menu size={20} />
          </Button>
        </header>
      )}

      {/* 2. 데스크탑용: 둥둥 떠 있는 햄버거 버튼 (md 이상에서만 노출) */}
      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-sidebar-btn bg-background/80 backdrop-blur-md rounded-main animate-in fade-in slide-in-from-left-5 hover:bg-accent-primary/10 hidden md:flex"
        >
          <Menu size={20} className="text-accent-primary" />
        </Button>
      )}

      {/* 메인 사이드바 */}
      <aside
        className={cn(
          'base-transition shrink-0 text-muted-foreground',

          // 모바일 (기본값)
          'fixed inset-y-0 left-0 z-sidebar-mobile w-sidebar bg-background shadow-2xl',
          'max-md:border-none',
          !isSidebarOpen && '-translate-x-full',

          // 데스크탑 (md 이상)
          'md:sticky md:top-0 md:h-screen md:z-sidebar md:overflow-hidden',
          'md:translate-x-0 md:bg-background/60 md:backdrop-blur-xl md:shadow-none',

          isSidebarOpen
            ? 'md:w-sidebar md:border-r md:border-solid md:border-muted-foreground/40'
            : 'md:w-0 md:border-none',
        )}
      >
        <div className="w-sidebar p-6 h-full flex flex-col">
          {/* Profile Section */}
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-main g-linear-to-tr from-(--palette-0) to-(--palette-2) shadow-inner" />
              <div>
                <h2 className="font-bold text-xl text-foreground tracking-tight">
                  Yejin
                </h2>
                <p className="text-xs text-muted-foreground font-medium">ㅇㅂㅇ</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="hover:bg-accent-primary/10 text-muted-foreground hover:text-accent-primary"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3">
            {categories.map((category) => {
              const isSelected = category.slug === selectedSlug;

              return (
                <Link
                  key={category.id}
                  href={category.href}
                  onClick={handleCategoryClick}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-main transition-all duration-300 group relative overflow-hidden',
                    isSelected
                      ? 'text-foreground font-medium pl-5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/40 hover:pl-5',
                  )}
                >
                  {isSelected && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-primary animate-in fade-in slide-in-from-left-1 duration-300" />
                  )}

                  <span
                    className={cn(
                      'transition-transform duration-300 group-hover:scale-110',
                      isSelected
                        ? 'text-accent-primary'
                        : 'text-muted-foreground/70',
                    )}
                  >
                    {CATEGORY_MAP[category.slug].icon}
                  </span>

                  <span className="text-sm font-semibold flex items-center gap-2">
                    {category.name}
                    {category.isPrivate && (
                      <Lock size={12} className="text-muted-foreground/40" />
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Tools */}
          <div className="pt-6 text-muted-foreground border-t border-muted-foreground/40 flex items-center justify-between">
            <div className="flex gap-3 text-muted-foreground">
              <a
                href="https://github.com/ImxYJL"
                className="hover:text-accent-primary base-transition"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:allensain14@gmail.com"
                className="hover:text-accent-primary base-transition"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* 모바일 전용 오버레이 */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-overlay md:hidden animate-in fade-in"
        />
      )}
    </>
  );
};

export default Sidebar;
