import { useState } from "react";
import Link from "next/link";
import Button from "./Button";
import { usePathname } from "next/navigation";
import { Github, Mail, Palette, X, Menu, BookOpen, Code } from "lucide-react";
import { cn } from "@/utils/styles";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  textColor: string;
};

const navItems: NavItem[] = [
  {
    label: "Reading",
    href: "/reading/posts",
    icon: <BookOpen size={20} />,
    textColor: "text-accent-primary",
  },
  {
    label: "Dev",
    href: "/dev",
    icon: <Code size={20} />,
    textColor: "text-[var(--palette-4)]",
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("rainbow");
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      {/* 1. 사이드바가 닫혔을 때 나타나는 플로팅 열기 버튼 */}
      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-sidebar-btn shadow-md bg-background/80 backdrop-blur-md border border-border rounded-main animate-in fade-in slide-in-from-left-5 hover:bg-accent-primary/10"
        >
          <Menu size={20} className="text-accent-primary" />
        </Button>
      )}

      {/* 2. 메인 사이드바 */}
      <aside
        className={cn(
          "border-r border-border base-transition shrink-0",
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
                <h2 className="font-bold text-xl tracking-tight">Yejin</h2>
                <p className="text-xs text-muted-foreground font-medium">
                  Frontend Developer
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
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
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
                      isActive ? item.textColor : "text-muted-foreground/70",
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-accent-primary animate-in zoom-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Tools */}
          <div className="pt-6 border-t border-border flex items-center justify-between">
            <div className="flex gap-3 text-muted-foreground">
              <a
                href="https://github.com"
                className="hover:text-accent-primary base-transition"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:test@test.com"
                className="hover:text-accent-primary base-transition"
              >
                <Mail size={20} />
              </a>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setTheme(theme === "rainbow" ? "ocean" : "rainbow")
              }
              className="text-[10px] h-7 px-2 font-bold border border-border/50 bg-background/50"
            >
              <Palette size={14} className="mr-1.5" />
              {theme.toUpperCase()}
            </Button>
          </div>
        </div>
      </aside>

      {/*  모바일 전용 오버레이 (사이드바 열렸을 때 배경 클릭 시 닫기) */}
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
