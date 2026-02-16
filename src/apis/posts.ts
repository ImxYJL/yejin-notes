import { API_ENDPOINT } from "@/constants/paths";
import type {
  CreatePostInput,
  PostDetail,
  PostsResponse,
  UpdatePostInput,
} from "@/types/blog";
import axiosInstance from "@/libs/axios/axios";
import { PaginationParams } from "@/types/page";

export const getPostsApi = async (
  categorySlug: string,
  params: PaginationParams,
): Promise<PostsResponse> => {
  const { data } = await axiosInstance.get(API_ENDPOINT.posts(), {
    params: {
      categorySlug: categorySlug,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
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
