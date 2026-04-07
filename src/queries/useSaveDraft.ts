import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import { useToastStore } from '@/store/useToastStore';
import { PostForm } from '@/types/blog';
import { savePostApi } from '@/apis/posts';
import { PAGE_PATH } from '@/constants/paths';
import { BLOG_QUERY_KEY } from './queryKey';

const useSaveDraft = () => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  // NOTE: 현재 임시저장과 발행된 글을 따로 관리하지 않으므로,
  // 이미 발행한 글에서 다시 임시저장을 할 경우 게시되었던 글도 목록에서 사라지게 됨!!
  return useMutation({
    mutationFn: (formData: PostForm) =>
      savePostApi({ ...formData, isPublished: false }),
    onSuccess: (newPost) => {
      showToast('임시저장에 성공했습니다.', 'success');

      queryClient.invalidateQueries({ queryKey: [BLOG_QUERY_KEY.drafts] });

      if (pathname.includes('write')) {
        router.replace(PAGE_PATH.admin.edit(newPost.id));
      }
    },
    onError: () => showToast('임시저장에 실패했습니다.', 'error'),
  });
};

export default useSaveDraft;
