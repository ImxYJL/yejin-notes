import { useQuery } from "@tanstack/react-query";
import { createSupabaseClient } from "@/libs/supabase/client";
import { ADMIN_QUERY_KEY } from "../queryKey";

const useIsAdmin = () => {
  const supabase = createSupabaseClient();

  const { data: user, isLoading } = useQuery({
    queryKey: [ADMIN_QUERY_KEY.authUser],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });

  return {
    isAdmin: !!user,
    isLoading,
  };
};

export default useIsAdmin;
