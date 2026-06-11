import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostForm } from '@/types/blog';
import { saveDraftApi } from '@/apis/posts';
import { PAGE_PATH } from '@/constants/paths';
import { BLOG_QUERY_KEY } from './queryKey';

const useSaveDraft = (onSuccess?: (id: string) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: PostForm) => saveDraftApi({ ...formData }),
    onSuccess: ({ id }, variables) => {
      window.history.replaceState(null, '', PAGE_PATH.admin.edit(id));

      // 첫 작성일 때 임시저장 목록 캐시 무효화
      if (!variables.id) {
        queryClient.invalidateQueries({ queryKey: [BLOG_QUERY_KEY.drafts] });
        // 서버로부터 받아온 id 세팅
        onSuccess?.(id);
      }
    },
    onError: (error: Error) => console.log(error.message),
  });
};

export default useSaveDraft;
