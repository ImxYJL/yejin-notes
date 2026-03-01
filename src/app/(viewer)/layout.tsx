import { cn } from "@/utils/styles";
import Sidebar from "@/components/common/Sidebar";
import { makeQueryClient } from "@/libs/tanstack/queryClient";
import { getAuthUser } from "@/services/authService";
import { getCategories } from "@/services/categoryService";
import { ADMIN_QUERY_KEY, BLOG_QUERY_KEY } from "@/queries/queryKey";

const ViewerLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = makeQueryClient();

  const [user, categories] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: [ADMIN_QUERY_KEY.authUser],
      queryFn: getAuthUser,
    }),
    queryClient.fetchQuery({
      queryKey: [BLOG_QUERY_KEY.categories],
      queryFn: getCategories,
    }),
  ]);

  const visibleCategories = user
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
