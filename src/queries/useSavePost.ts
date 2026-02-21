import { PAGE_PATH } from "@/constants/paths";
import { BLOG_QUERY_KEY } from "./queryKey";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/useToastStore";
import { EditorMode, PostForm } from "@/types/blog";
import { savePostApi } from "@/apis/posts";

const useSavePost = (mode: EditorMode) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: (formData: PostForm) => savePostApi(formData),
    onSuccess: (newPost) => {
      const message =
        mode === "create"
          ? "기록을 성공적으로 남겼습니다!"
          : "기록이 수정되었습니다.";

      showToast(message, "success");

      queryClient.invalidateQueries({ queryKey: [BLOG_QUERY_KEY.posts] });

      router.push(PAGE_PATH.postDetail(newPost.category_slug, newPost.id));
    },
    onError: (error: Error) => showToast(error.message, "error"),
  });
};

export default useSavePost;
