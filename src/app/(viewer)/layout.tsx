"use client";

import useLayoutStore from "@/store/useLayoutStore";
import { cn } from "@/utils/styles";
import { Menu } from "lucide-react";
import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/common";

const ViewerLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen, toggleSidebar } = useLayoutStore();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="fixed left-6 top-6 z-sidebar-btn p-2 rounded-main bg-background/50 backdrop-blur-md border border-border shadow-sm hover:bg-accent-primary/10 text-muted-foreground hover:text-accent-primary animate-in fade-in slide-in-from-left-2"
        >
          <Menu size={20} />
        </Button>
      )}

      <main className="flex-1 min-w-0 flex flex-col base-transition">
        <div className="flex-1 overflow-y-auto">
          <div
            className={cn(
              "mx-auto pb-20 pt-20 base-transition",
              "max-w-content",
              "px-6",
              "md:px-16",
              "lg:px-24",
              "xl:px-32",
            )}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewerLayout;
