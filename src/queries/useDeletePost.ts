import { deletePostApi } from "@/apis/posts";
import { PAGE_PATH } from "@/constants/paths";
import { useToastStore } from "@/store/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BLOG_QUERY_KEY } from "./queryKey";
import { CategorySlug } from "@/types/blog";

const useDeletePost = (slug: CategorySlug) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: (postId: string) => deletePostApi(postId),
    onSuccess: () => {
      showToast("게시글이 삭제되었습니다.", "success");

      queryClient.invalidateQueries({ queryKey: [BLOG_QUERY_KEY.posts] });

      router.push(PAGE_PATH.posts(slug));
    },
    onError: (error: Error) => showToast(error.message, "error"),
  });
};

export default useDeletePost;
