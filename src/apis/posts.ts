import { API_ENDPOINT } from "@/constants/paths";
import type {
  CategorySlug,
  PostDetailResponse,
  PostForm,
  PostsResponse,
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

export const getPostApi = async (id: string): Promise<PostDetailResponse> => {
  const { data } = await axiosInstance.get(API_ENDPOINT.post(id));

  return data.data;
};

export const savePostApi = async (formData: PostForm) => {
  const { data } = await axiosInstance.patch(
    API_ENDPOINT.post(formData.id),
    formData,
  );

  return data.data;
};

export const deletePostApi = async (id: string) => {
  await axiosInstance.delete(API_ENDPOINT.post(id));
};
