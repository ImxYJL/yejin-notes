"use client";

import Link from "next/link";
import Button from "./Button";
import { Github, Mail, Palette, X, Menu, Lock } from "lucide-react";
import { cn } from "@/utils/styles";
import useLayoutStore from "@/store/useLayoutStore";
import useThemeStore from "@/store/useThemeStore";
import { Category } from "@/types/blog";
import { PAGE_PATH } from "@/constants/paths";
import useCurrentCategory from "@/hooks/useCurrentCategory";
import { CATEGORY_MAP } from "@/constants/blog";

type Props = {
  categories: Category[];
};

const Sidebar = ({ categories }: Props) => {
  const { isSidebarOpen, toggleSidebar } = useLayoutStore();
  const { theme, setTheme } = useThemeStore();
  const { isActiveCategory } = useCurrentCategory();

  return (
    <>
      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-sidebar-btn bg-background/80 backdrop-blur-md rounded-main animate-in fade-in slide-in-from-left-5 hover:bg-accent-primary/10"
        >
          <Menu size={20} className="text-accent-primary" />
        </Button>
      )}

      {/* 메인 사이드바 */}
      <aside
        className={cn(
          "border-r border-border base-transition shrink-0 text-muted-foreground",
          "max-md:border-none",
          "md:bg-background/60 md:backdrop-blur-xl",
          "max-md:bg-background max-md:backdrop-blur-none max-md:shadow-2xl",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-(--z-sidebar-mobile) max-md:w-sidebar",
          !isSidebarOpen && "max-md:-translate-x-full",
          "md:sticky md:top-0 md:h-screen md:overflow-hidden md:z-sidebar",
          isSidebarOpen ? "md:w-sidebar" : "md:w-0 md:border-none",
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
                <p className="text-xs text-muted-foreground font-medium">
                  밥 열심히 먹는 사람
                </p>
              </div>
            </div>

            {/* 닫기 버튼 (모바일/데스크탑 모두 사이드바 내부에서는 닫기 기능만 수행) */}
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
              const isActive = isActiveCategory(category.slug);
              const href = PAGE_PATH.posts(category.slug);

              return (
                <Link
                  key={category.id}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-main base-transition group relative",
                    isActive
                      ? "bg-white shadow-sm text-foreground"
                      : "hover:bg-white/50 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "base-transition group-hover:scale-110",
                      isActive
                        ? CATEGORY_MAP[category.slug].textColor
                        : "text-muted-foreground/70",
                    )}
                  >
                    {CATEGORY_MAP[category.slug].icon}
                  </span>

                  {/* 라벨 및 비공개 아이콘 */}
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
          <div className="pt-6 text-muted-foreground border-t border-border flex items-center justify-between">
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
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setTheme(theme === "rainbow" ? "ocean" : "rainbow")
              }
              className="text-[10px] h-7 px-2 font-bold border border-border/50 bg-background/50"
            >
              <Palette size={14} className="mr-1.5" />
              {theme.toUpperCase()}
            </Button> */}
          </div>
        </div>
      </aside>

      {/*  모바일 전용 오버레이 */}
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
