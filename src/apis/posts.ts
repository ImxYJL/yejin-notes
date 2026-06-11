import { API_ENDPOINT } from '@/constants/paths';
import type {
  CategorySlug,
  DraftPostItem,
  EditorPost,
  Post,
  PostDetailResponse,
  PostForm,
  PostsResponse,
  SaveDraftResponse,
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
 * [Admin] 포스트 상세 조회
 */
export const getAdminPostApi = async (id: string): Promise<PostDetailResponse> => {
  const { data } = await axiosInstance.get(API_ENDPOINT.admin.post(id));
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
  const { data } = await axiosInstance.post(API_ENDPOINT.admin.post(), formData);
  return data.data;
};

/**
 * [Admin] 포스트 삭제
 */
export const deletePostApi = async (id: string): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINT.admin.post(id));
};

/**
 * [Admin] 임시 저장된 포스트(초안) 목록 조회
 */
export const getDraftsApi = async (): Promise<DraftPostItem[]> => {
  const { data } = await axiosInstance.get(API_ENDPOINT.admin.drafts);
  return data.data;
};

/**
 * [Admin] 임시 저장된 포스트 삭제
 */
export const deleteDraftApi = async (id: string): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINT.admin.draft(id));
};

/**
 * [Admin] 포스트 임시저장
 */
export const saveDraftApi = async (
  formData: PostForm,
): Promise<SaveDraftResponse> => {
  const { data } = await axiosInstance.post(API_ENDPOINT.admin.drafts, formData);

  return data.data;
};

/**
 * [Admin] 에디터용 포스트 불러오기
 */
export const getEditorPostApi = async (id: string): Promise<EditorPost> => {
  const { data } = await axiosInstance.get(API_ENDPOINT.admin.draft(id));

  return data.data;
};
