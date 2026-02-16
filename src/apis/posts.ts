import { API_ENDPOINT } from "@/constants/paths";
import type {
  CategorySlug,
  CreatePostInput,
  PostDetailResponse,
  PostsResponse,
  UpdatePostInput,
} from "@/types/blog";
import axiosInstance from "@/libs/axios/axios";
import { PaginationParams } from "@/types/page";
import { QUERY_PARAMS } from "@/constants/system";

export const getPostsApi = async (
  categorySlug: CategorySlug,
  params: PaginationParams,
): Promise<PostsResponse> => {
  const { data } = await axiosInstance.get(API_ENDPOINT.posts, {
    params: {
      [QUERY_PARAMS.categorySlug]: categorySlug,
      [QUERY_PARAMS.page]: params.page ?? 1,
      [QUERY_PARAMS.limit]: params.limit ?? 10,
    },
  });
  return data.data;
};

export const getPostApi = async (id: string, categorySlug: CategorySlug) => {
  const { data } = await axiosInstance.get(API_ENDPOINT.post(id), {
    params: { categorySlug },
  });

  return data.data;
};

export const createPostApi = async (
  input: CreatePostInput,
): Promise<PostDetailResponse> => {
  const { data } = await axiosInstance.post(API_ENDPOINT.post(input.id), input);
  return data.data;
};

export const updatePostApi = async (
  id: string,
  input: UpdatePostInput,
): Promise<PostDetailResponse> => {
  const { data } = await axiosInstance.patch(API_ENDPOINT.post(id), input);
  return data.data;
};

export const deletePostApi = async (id: string) => {
  await axiosInstance.delete(API_ENDPOINT.post(id));
};
