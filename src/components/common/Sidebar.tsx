"use client";

import useLayoutStore from "@/store/useLayoutStore";
import useThemeStore from "@/store/useThemeStore";
import { LAYOUT_CONFIG } from "@/constants/styles";
import { Github, Mail, Book, Code, X, Palette } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/styles";
import Button from "./Button";

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useLayoutStore();
  const { theme, setTheme } = useThemeStore();

  const navItems = [
    {
      label: "Reading",
      href: "/reading",
      icon: <Book size={18} />,
      textColor: "text-accent-primary",
    },
    {
      label: "Dev",
      href: "/dev",
      icon: <Code size={18} />,
      textColor: "text-[var(--palette-4)]",
    },
  ];

  return (
    <aside
      style={{ width: `${LAYOUT_CONFIG.sidebarWidth}px` }}
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-background/50 backdrop-blur-xl border-r border-border",
        "base-transition",
        !isSidebarOpen && "-translate-x-full",
      )}
    >
      <div className="flex flex-col h-full p-6">
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
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-main hover:bg-white hover:shadow-sm base-transition group"
            >
              <span
                className={cn(
                  "base-transition group-hover:scale-110",
                  item.textColor,
                )}
              >
                {item.icon}
              </span>
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Tools */}
        <div className="pt-6 border-t border-border flex items-center justify-between">
          <div className="flex gap-3 text-muted-foreground">
            <a
              href="https://github.com"
              className="hover:text-foreground base-transition"
            >
              <Github size={20} />
            </a>
            <a
              href="mailto:test@test.com"
              className="hover:text-foreground base-transition"
            >
              <Mail size={20} />
            </a>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "rainbow" ? "ocean" : "rainbow")}
            icon={<Palette size={16} />}
            className="text-[10px] h-7 px-2 font-bold"
          >
            {theme.toUpperCase()}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
