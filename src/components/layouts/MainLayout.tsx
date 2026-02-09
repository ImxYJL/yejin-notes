"use client";

import { ReactNode } from "react";
import useLayoutStore from "@/store/useLayoutStore";
import { cn } from "@/utils/styles";
import { Menu } from "lucide-react";
import Button from "../common/Button";
import { LAYOUT_CONFIG } from "@/constants/styles";
import Sidebar from "../common/Sidebar";
import { usePathname } from "next/navigation";

type LayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: LayoutProps) => {
  const { isSidebarOpen, toggleSidebar } = useLayoutStore();
  const pathname = usePathname();

  const isEditorPage =
    pathname.startsWith("/write") || pathname.startsWith("/edit");

  return (
    <div className="min-h-screen bg-background text-foreground base-transition">
      {!isEditorPage && <Sidebar />}

      <main
        style={
          {
            "--sidebar-w": `${LAYOUT_CONFIG.sidebarWidth}px`,
            "--header-h": `${LAYOUT_CONFIG.headerHeight}px`,
            "--content-max-w": isEditorPage
              ? "1280px"
              : `${LAYOUT_CONFIG.contentMaxWidth}px`,
          } as React.CSSProperties
        }
        className={cn(
          "min-h-screen base-transition",
          // 사이드바가 열려있고 에디터가 아닐 때만 패딩 적용
          !isEditorPage && isSidebarOpen ? "pl-(--sidebar-w)" : "pl-0",
          !isEditorPage && "max-md:pl-0!", // 모바일 환경 강제 초기화
        )}
      >
        <header className="h-(--header-h) flex items-center px-6 sticky top-0 z-30 bg-background/50 backdrop-blur-md">
          {!isEditorPage && !isSidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Menu size={20} />}
              onClick={toggleSidebar}
              className="-ml-2"
            />
          )}
        </header>

        <div className="mx-auto px-6 pb-20 max-w-(--content-max-w) base-transition">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
