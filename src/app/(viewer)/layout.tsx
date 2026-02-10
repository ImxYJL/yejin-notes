"use client";

import useLayoutStore from "@/store/useLayoutStore";
import { cn } from "@/utils/styles";
import { Menu } from "lucide-react";
import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/common";

const ViewerLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen, toggleSidebar } = useLayoutStore();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main
        className={cn(
          "min-h-screen base-transition",
          isSidebarOpen ? "pl-(--sidebar-w)" : "pl-0",
          "max-md:pl-0!",
        )}
      >
        <header className="h-(--header-h) sticky top-0 z-30 bg-background/50 backdrop-blur-md px-6 flex items-center">
          {!isSidebarOpen && (
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

export default ViewerLayout;
