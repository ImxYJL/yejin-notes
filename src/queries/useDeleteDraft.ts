import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BLOG_QUERY_KEY } from './queryKey';
import { deleteDraftApi } from '@/apis/posts';
import { useToastStore } from '@/store/useToastStore';

const useDeleteDraft = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: (id: string) => deleteDraftApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BLOG_QUERY_KEY.drafts] });

      showToast('성공적으로 삭제했습니다.', 'success');
    },
    onError: (error) => {
      console.error('삭제 실패:', error);
      showToast('삭제에 실패했습니다.', 'error');
    },
  });
};

export default useDeleteDraft;
