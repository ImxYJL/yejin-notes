import { createSupabaseClient } from "@/libs/supabase/client";
import { useToastStore } from "@/store/useToastStore";
import { useMutation } from "@tanstack/react-query";

const useLogin = () => {
  const { showToast } = useToastStore();
  const supabase = createSupabaseClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return data;
    },
    onError: (error: Error) => showToast(error.message, "error"),
  });

  return {
    mutate,
    isPending,
  };
};

export default useLogin;
