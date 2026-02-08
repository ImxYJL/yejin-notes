"use client";

import useLayoutStore from "@/store/useLayoutStore";
import useThemeStore from "@/store/useThemeStore";
import { LAYOUT_CONFIG, ANIMATION_CONFIG } from "@/constants/styles";
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
      color: "var(--palette-5)",
    },
    {
      label: "Dev",
      href: "/dev",
      icon: <Code size={18} />,
      color: "var(--palette-4)",
    },
  ];

  return (
    <aside
      style={{ width: `${LAYOUT_CONFIG.sidebarWidth}px` }}
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-gray-50/50 backdrop-blur-xl border-r border-border transition-transform",
        ANIMATION_CONFIG.default,
        !isSidebarOpen && "-translate-x-full",
      )}
    >
      <div className="flex flex-col h-full p-6">
        {/* Profile */}
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-palette-0 to-palette-2 shadow-inner" />
            <div>
              <h2 className="font-bold text-xl tracking-tight">YourNickname</h2>
              <p className="text-xs text-muted-foreground">
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

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
            >
              <span
                style={{ color: item.color }}
                className="transition-transform group-hover:scale-110"
              >
                {item.icon}
              </span>
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Tools */}
        <div className="pt-6 border-t flex items-center justify-between">
          <div className="flex gap-3 text-muted-foreground">
            <a href="https://github.com">
              <Github size={20} />
            </a>
            <a href="mailto:test@test.com">
              <Mail size={20} />
            </a>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "rainbow" ? "ocean" : "rainbow")}
            icon={<Palette size={16} />}
            className="text-[10px] h-7"
          >
            {theme.toUpperCase()}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
