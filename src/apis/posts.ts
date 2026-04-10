import { API_ENDPOINT } from '@/constants/paths';
import type {
  CategorySlug,
  DraftPost,
  Post,
  PostDetailResponse,
  PostForm,
  PostsResponse,
} from '@/types/blog';
import axiosInstance from '@/libs/axios/axios';
import { PaginationParams } from '@/types/page';
import { QUERY_PARAMS } from '@/constants/system';

/**
 * [Public] 특정 카테고리의 공개 포스트 목록 조회
 */
export const getPublicPostsApi = async (
  categorySlug: CategorySlug,
  params: PaginationParams,
): Promise<PostsResponse> => {
  const { data } = await axiosInstance.get(API_ENDPOINT.posts(categorySlug), {
    params: {
      [QUERY_PARAMS.page]: params.page ?? 1,
      [QUERY_PARAMS.limit]: params.limit ?? 10,
    },
  });
  return data.data;
};

/**
 * [Public] 포스트 상세 조회
 */
export const getPostApi = async (id: string): Promise<PostDetailResponse> => {
  const { data } = await axiosInstance.get(API_ENDPOINT.post(id));
  return data.data;
};

/**
 * [Admin] 특정 카테고리의 관리자용 포스트 목록 조회 (비공개 포함)
 */
export const getAdminPostsApi = async (
  categorySlug: CategorySlug,
  params: PaginationParams,
): Promise<PostsResponse> => {
  const { data } = await axiosInstance.get(API_ENDPOINT.admin.posts(categorySlug), {
    params: {
      [QUERY_PARAMS.page]: params.page ?? 1,
      [QUERY_PARAMS.limit]: params.limit ?? 10,
    },
  });
  return data.data;
};

/**
 * [Admin] 포스트 수정/저장
 */
export const savePostApi = async (formData: PostForm): Promise<Post> => {
  const { data } = await axiosInstance.patch(
    API_ENDPOINT.admin.post(formData.id, formData.categorySlug),
    formData,
  );
  return data.data;
};

/**
 * [Admin] 포스트 삭제
 */
export const deletePostApi = async (
  id: string,
  categorySlug: CategorySlug,
): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINT.admin.post(id, categorySlug));
};

/**
 * [Admin] 임시 저장된 포스트(초안) 목록 조회
 */
export const getDraftsApi = async (): Promise<DraftPost[]> => {
  const { data } = await axiosInstance.get(API_ENDPOINT.admin.drafts);
  return data.data;
};
