import { API_ENDPOINT } from "@/constants/paths";
import type {
  CreatePostInput,
  PostDetail,
  PostItem,
  UpdatePostInput,
} from "@/types/blog";
import axiosInstance from "@/libs/axios/axios";

export const getPostsApi = async (
  categoryName?: string,
): Promise<PostItem[]> => {
  const { data } = await axiosInstance.get(API_ENDPOINT.posts(), {
    params: { category: categoryName },
  });

  return data.data;
};

export const getPostApi = async (id: string, categoryName: string) => {
  const { data } = await axiosInstance.get(API_ENDPOINT.posts(id), {
    params: { category: categoryName },
  });

  return data.data;
};

export const createPostApi = async (
  input: CreatePostInput,
): Promise<PostDetail> => {
  const { data } = await axiosInstance.post(API_ENDPOINT.posts(), input);
  return data.data;
};

export const updatePostApi = async (
  id: string,
  input: UpdatePostInput,
): Promise<PostDetail> => {
  const { data } = await axiosInstance.patch(API_ENDPOINT.posts(id), input);
  return data.data;
};

export const deletePostApi = async (id: string) => {
  await axiosInstance.delete(API_ENDPOINT.posts(id));
};
