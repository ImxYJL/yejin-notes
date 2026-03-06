import { cn } from "@/utils/styles";
import Sidebar from "@/components/common/Sidebar";
import { getAuthUser } from "@/services/authService";
import { getCategories } from "@/services/categoryService";

const ViewerLayout = async ({ children }: { children: React.ReactNode }) => {
  const [user, categories] = await Promise.all([
    getAuthUser(),
    getCategories(),
  ]);

  const visibleCategories = user?.isAdmin
    ? categories
    : categories.filter((category) => !category.isPrivate);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar categories={visibleCategories} />

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
