"use client";

import { cn } from "@/utils/styles";
import Sidebar from "@/components/common/Sidebar";

const ViewerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main
        className={cn(
          "flex-1 min-w-0 min-h-screen base-transition flex flex-col overflow-y-auto",
          "mx-auto pb-20 pt-20",
          "max-w-content w-full",
          "px-6 md:px-16 lg:px-24 xl:px-32",
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default ViewerLayout;
