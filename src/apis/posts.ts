import { API_ENDPOINT } from "@/constants/paths";
import axiosInstance from "@/libs/axios/axios";
import type { PostItemType } from "@/types/blog";

export const getPostsApi = async (
  categoryName?: string,
): Promise<PostItemType[]> => {
  const { data } = await axiosInstance.get(API_ENDPOINT.posts(), {
    params: { category: categoryName },
  });

  return data.data;
};

export const getPostApi = async (postId: string, categoryName: string) => {
  const { data } = await axiosInstance.get(API_ENDPOINT.posts(postId), {
    params: { category: categoryName },
  });

  return data.data;
};
