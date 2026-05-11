import { useSuspenseQuery } from '@tanstack/react-query';
import { BLOG_QUERY_KEY } from './queryKey';
import { getAdminPostApi } from '@/apis/posts';

const useAdminPost = (postId: string) => {
  return useSuspenseQuery({
    queryKey: [BLOG_QUERY_KEY.post, postId],
    queryFn: () => getAdminPostApi(postId),
    staleTime: 1000 * 60 * 60,
  });
};

export default useAdminPost;
