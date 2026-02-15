import { createPostApi } from "@/apis/posts";
import { useToastStore } from "@/store/useToastStore";
import { CreatePostInput, PostDetail } from "@/types/blog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { BLOG_QUERY_KEY } from "./queryKey";
import { PAGE_PATH } from "@/constants/paths";

const useCreatePost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: (input: CreatePostInput) => createPostApi(input),
    onSuccess: (newPost: PostDetail) => {
      showToast("게시글을 성공적으로 업로드했습니다!", "success");

      queryClient.invalidateQueries({ queryKey: [BLOG_QUERY_KEY.posts] });

      router.push(PAGE_PATH.postDetail(newPost.category.slug, newPost.id));
    },
    onError: (error: Error) => showToast(error.message, "error"),
  });
};

export default useCreatePost;
