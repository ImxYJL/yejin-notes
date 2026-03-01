import { PAGE_PATH } from "@/constants/paths";
import { BLOG_QUERY_KEY } from "./queryKey";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/useToastStore";
import { PostForm } from "@/types/blog";
import { savePostApi } from "@/apis/posts";

const useSavePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: (formData: PostForm) =>
      savePostApi({ ...formData, isPublished: true }),
    onSuccess: (newPost) => {
      showToast("저장이 완료되었습니다.", "success");

      queryClient.invalidateQueries({
        queryKey: [BLOG_QUERY_KEY.posts, BLOG_QUERY_KEY.drafts],
      });

      router.push(PAGE_PATH.postDetail(newPost.category.slug, newPost.id));
    },
    onError: (error: Error) => showToast(error.message, "error"),
  });
};

export default useSavePost;
