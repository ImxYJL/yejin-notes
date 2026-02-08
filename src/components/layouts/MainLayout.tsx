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

  // 에디터 관련 페이지인지 확인 (작성/수정)
  const isEditorPage =
    pathname.startsWith("/write") || pathname.startsWith("/edit");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. 에디터 페이지가 아닐 때만 사이드바 렌더링 (혹은 상태에 따라) */}
      {!isEditorPage && <Sidebar />}

      <main
        style={{
          // 에디터 페이지면 여백 0, 아니면 사이드바 상태에 따라 조절
          paddingLeft:
            !isEditorPage && isSidebarOpen
              ? `${LAYOUT_CONFIG.sidebarWidth}px`
              : "0px",
        }}
        className={cn(
          "transition-[padding] min-h-screen",
          "base-transition",
          !isEditorPage && "max-md:pl-0!",
        )}
      >
        {/* 2. 상단 헤더: 에디터가 아닐 때만 햄버거 버튼 노출 */}
        <header
          style={{ height: `${LAYOUT_CONFIG.headerHeight}px` }}
          className="flex items-center px-6 sticky top-0 z-30 bg-background/50 backdrop-blur-md"
        >
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

        {/* 3. 콘텐츠 영역: 에디터면 더 넓게(max-w-5xl), 일반글이면 집중형(max-w-4xl) */}
        <div
          style={{
            maxWidth: isEditorPage
              ? "1280px"
              : `${LAYOUT_CONFIG.contentMaxWidth}px`,
          }}
          className="mx-auto px-6 pb-20"
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
