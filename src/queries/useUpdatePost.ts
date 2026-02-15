import { updatePostApi } from "@/apis/posts";
import { PAGE_PATH } from "@/constants/paths";
import { useToastStore } from "@/store/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { BLOG_QUERY_KEY } from "./queryKey";
import { PostDetail, UpdatePostInput } from "@/types/blog";

const useUpdatePost = (postId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: (input: UpdatePostInput) => updatePostApi(postId, input),
    onSuccess: (updatedPost: PostDetail) => {
      showToast("게시글이 수정되었습니다.", "success");

      queryClient.invalidateQueries({ queryKey: [BLOG_QUERY_KEY.posts] });
      queryClient.invalidateQueries({
        queryKey: [BLOG_QUERY_KEY.post, postId],
      });

      router.push(PAGE_PATH.posts(updatedPost.category.slug));
    },
    onError: (error: Error) => showToast(error.message, "error"),
  });
};

export default useUpdatePost;
