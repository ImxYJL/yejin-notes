import { createSupabaseClient } from '@/libs/supabase/client';
import { useToastStore } from '@/store/useToastStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ADMIN_QUERY_KEY } from '../queryKey';

const useLogin = () => {
  const { showToast } = useToastStore();
  const queryClient = useQueryClient();
  const supabase = createSupabaseClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY.isAdmin] });
    },
    onError: (error: Error) => showToast(error.message, 'error'),
  });

  return {
    mutate,
    isPending,
  };
};

export default useLogin;
