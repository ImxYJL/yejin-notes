import 'server-only';

import { createServerSupabaseClient } from '@/libs/supabase/server';
import { AppError } from '@/utils/error';
import {
  getAllCategories,
  getCategoryBySlug,
  getPublicCategories,
  validateCategoryAccess,
} from './categoryService';
import { getAuthUser, validateAdmin } from './authService';
import {
  CategorySlug,
  DraftData,
  DraftPostItem,
  EditorPost,
  Post,
  PostDetailResponse,
  PostForm,
  PostItem,
  PostItemRow,
  PostNavigation,
  PostRow,
  PublishedPostRow,
  SaveDraftResponse,
} from '@/types/blog';
import { publicSupabase } from '@/libs/supabase/client';
import { revalidateTag, unstable_cache } from 'next/cache';
import { NEXT_CACHE_KEY, NEXT_CACHE_TAG } from '@/constants/blog';
import { SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_PAGE_LIMIT = 10;
const MAX_PAGE_LIMIT = 50;

// ----------------------------------------------------------------
// Public (anon, SSG 가능)
// RLS: is_published = true AND is_private = false AND 카테고리도 공개
// ----------------------------------------------------------------
export const getPublicPosts = (
  categorySlug: CategorySlug,
  page: number = 1,
  limit?: number,
) =>
  unstable_cache(
    async (categorySlug: CategorySlug, page: number, limit?: number) => {
      const categories = await getPublicCategories();
      validateCategoryAccess(categorySlug, categories, null);

      const LIMIT = Math.min(limit || DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT);
      const from = (page - 1) * LIMIT;
      const to = from + LIMIT - 1;

      const { data, count, error } = await publicSupabase
        .from('posts')
        .select(
          `
          id, title, summary, category_id, tags,
          is_private, is_published, thumbnail_url, created_at, updated_at,
          category:categories!inner(slug, name)
          `,
          { count: 'exact' },
        )
        .eq('category.slug', categorySlug)
        .eq('is_published', true)
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw AppError.fromSupabase(error);

      return {
        posts: (data || []).map(mapPostItemResponse),
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / LIMIT),
        currentPage: page,
      };
    },
    [NEXT_CACHE_KEY.posts, categorySlug, String(page), String(limit)],
    {
      tags: [NEXT_CACHE_TAG.posts, NEXT_CACHE_TAG.categoryPosts(categorySlug)],
    },
  )(categorySlug, page, limit);

export const getPublicPost = (postId: string) =>
  unstable_cache(
    async (postId: string): Promise<Post> => {
      const { data, error } = await publicSupabase
        .from('posts')
        .select(
          `
            id,
            title,
            content,
            summary,
            category_id,
            tags,
            is_private,
            is_published,
            thumbnail_url,
            created_at,
            updated_at,
            category:categories(slug, name)
          `,
        )
        .eq('id', postId)
        .single();

      if (error || !data) throw AppError.notFound();

      return mapPostDetailResponse(data as PublishedPostRow);
    },
    [NEXT_CACHE_KEY.post(postId)],
    {
      tags: [NEXT_CACHE_TAG.post(postId)],
    },
  )(postId);

export const getPublicPostNavigation = async (
  categorySlug: CategorySlug,
  createdAt: string,
): Promise<PostNavigation> => {
  return getPostNavigation({
    supabase: publicSupabase,
    categorySlug,
    createdAt,
    includePrivate: false,
  });
};

export const getPublicPostDetail = async (
  postId: string,
): Promise<PostDetailResponse> => {
  const post = await getPublicPost(postId);

  const navigation = await getPublicPostNavigation(
    post.category.slug,
    post.createdAt,
  );

  return {
    ...post,
    ...navigation,
  };
};

// ----------------------------------------------------------------
// Admin (serverSupabase, SSR)
// RLS: auth.uid() = user_id (full access)
// ----------------------------------------------------------------

export const getAdminPosts = async (
  categorySlug: CategorySlug,
  page: number = 1,
  limit?: number,
) => {
  await validateAdmin();

  const [categories, user] = await Promise.all([getAllCategories(), getAuthUser()]);
  validateCategoryAccess(categorySlug, categories, user);

  const LIMIT = Math.min(limit || DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT);
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  const supabase = await createServerSupabaseClient();
  const { data, count, error } = await supabase
    .from('posts')
    .select(
      `
        id, title, summary, category_id, tags,
        is_private, is_published, thumbnail_url, created_at, updated_at,
        category:categories!inner(slug, name)
        `,
      { count: 'exact' },
    )
    .eq('category.slug', categorySlug)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw AppError.fromSupabase(error);

  return {
    posts: (data || []).map(mapPostItemResponse),
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / LIMIT),
    currentPage: page,
  };
};

export const getAdminPost = async (postId: string): Promise<Post> => {
  await validateAdmin();

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
        id,
        title,
        content,
        summary,
        category_id,
        tags,
        is_private,
        is_published,
        thumbnail_url,
        created_at,
        updated_at,
        category:categories(slug, name)
      `,
    )
    .eq('id', postId)
    .single();

  if (error || !data) throw AppError.notFound();

  return mapPostDetailResponse(data as PublishedPostRow);
};

export const getAdminPostDetail = async (
  postId: string,
): Promise<PostDetailResponse> => {
  const post = await getAdminPost(postId);

  const navigation = await getAdminPostNavigation(
    post.category.slug,
    post.createdAt,
  );

  return {
    ...post,
    ...navigation,
  };
};

export const getAdminPostNavigation = async (
  categorySlug: CategorySlug,
  createdAt: string,
): Promise<PostNavigation> => {
  await validateAdmin();
  const supabase = await createServerSupabaseClient();

  return getPostNavigation({
    supabase,
    categorySlug,
    createdAt,
    includePrivate: true,
  });
};

export const publishPost = async (formData: PostForm): Promise<Post> => {
  const supabase = await createServerSupabaseClient();
  const isEditMode = !!formData.id;

  const [user, category] = await Promise.all([
    validateAdmin(),
    getCategoryBySlug(formData.categorySlug),
  ]);

  // 기존 글 캐시 무효화 (이전 글/다음 글 등)
  if (isEditMode) {
    const oldPost = await getAdminPost(formData.id!).catch(() => null);
    if (oldPost) {
      await revalidateAdjacentPosts(oldPost.category.slug, oldPost.createdAt);
    }
  }

  const postPayload: Record<string, unknown> = {
    title: formData.title,
    content: formData.content,
    summary: formData.summary,
    category_id: category.id,
    tags: formData.tags,
    is_private: formData.isPrivate,
    is_published: formData.isPublished,
    thumbnail_url: formData.thumbnailUrl,
    user_id: user.id,

    // NOTE: 임시저장 비우기
    draft_data: null,
  };

  if (isEditMode) {
    postPayload.id = formData.id;
  }

  const { data, error } = await supabase
    .from('posts')
    .upsert(postPayload, { onConflict: 'id' })
    .select('*, category:categories!inner(slug, name)')
    .single();

  if (error) throw AppError.fromSupabase(error);
  if (!data) throw AppError.internal('데이터 처리에 실패했습니다.');

  const finalId = formData.id ?? data.id;
  revalidateTag(NEXT_CACHE_TAG.post(finalId), 'default');
  revalidateTag(NEXT_CACHE_TAG.categoryPosts(formData.categorySlug), 'default');
  revalidateTag(NEXT_CACHE_TAG.posts, 'default');

  const newPost = mapPostDetailResponse(data);
  await revalidateAdjacentPosts(newPost.category.slug, newPost.createdAt);

  return newPost;
};

export const deletePost = async (id: string) => {
  await validateAdmin();
  const supabase = await createServerSupabaseClient();

  const targetPost = await getAdminPost(id);
  await revalidateAdjacentPosts(targetPost.category.slug, targetPost.createdAt);

  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw AppError.fromSupabase(error);

  revalidateTag(NEXT_CACHE_TAG.post(id), 'default');
  revalidateTag(NEXT_CACHE_TAG.categoryPosts(targetPost.category.slug), 'default');
  revalidateTag(NEXT_CACHE_TAG.posts, 'default');
};

export const getDrafts = async (): Promise<DraftPostItem[]> => {
  await validateAdmin();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, createdAt:created_at')
    .eq('is_published', false)
    .order('created_at', { ascending: false });

  if (error) throw AppError.fromSupabase(error);
  return (data as DraftPostItem[]) || [];
};

export const getEditorPost = async (postId: string): Promise<EditorPost> => {
  await validateAdmin();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
        id,
        title,
        content,
        summary,
        category_id,
        tags,
        is_private,
        is_published,
        thumbnail_url,
        created_at,
        updated_at,
        draft_data,
        category:categories(slug, name)
      `,
    )
    .eq('id', postId)
    .single();

  if (error) {
    throw AppError.fromSupabase(error);
  }

  return mapEditorPostResponse(data);
};

export const saveDraft = async (formData: PostForm): Promise<SaveDraftResponse> => {
  const supabase = await createServerSupabaseClient();

  const [user, category] = await Promise.all([
    validateAdmin(),
    getCategoryBySlug(formData.categorySlug),
  ]);

  console.log(formData);

  const draftData: DraftData = {
    title: formData.title,
    content: formData.content,
    summary: formData.summary,
    tags: formData.tags,
    thumbnailUrl: formData.thumbnailUrl,
    isPrivate: formData.isPrivate,
  };

  // 수정
  if (formData.id) {
    const { data, error } = await supabase
      .from('posts')
      .update({
        draft_data: draftData,
      })
      .eq('id', formData.id)
      .select('id')
      .single();

    if (error) throw AppError.fromSupabase(error);
    if (!data) throw AppError.internal('임시 저장에 실패했습니다.');

    return {
      id: data.id,
    };
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: '',
      content: '',
      summary: '',
      category_id: category.id,

      tags: [],
      is_private: false,
      is_published: false,

      thumbnail_url: null,

      user_id: user.id,

      draft_data: draftData,
    })
    .select('id')
    .single();

  if (error) throw AppError.fromSupabase(error);
  if (!data) throw AppError.internal('임시 저장에 실패했습니다.');

  return {
    id: data.id,
  };
};

export const deleteDraft = async (id: string) => {
  await validateAdmin();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw AppError.fromSupabase(error);
};

// ----------------------------------------------------------------
// 공통 유틸
// ----------------------------------------------------------------

const revalidateAdjacentPosts = async (
  categorySlug: CategorySlug,
  createdAt: string,
) => {
  const navigation = await getAdminPostNavigation(categorySlug, createdAt);
  if (navigation.prevPost) {
    revalidateTag(NEXT_CACHE_TAG.post(navigation.prevPost.id), 'default');
  }
  if (navigation.nextPost) {
    revalidateTag(NEXT_CACHE_TAG.post(navigation.nextPost.id), 'default');
  }
};

type GetPostNavigationParams = {
  supabase: SupabaseClient;
  categorySlug: CategorySlug;
  createdAt: string;
  includePrivate: boolean;
};

export const getPostNavigation = async ({
  supabase,
  categorySlug,
  createdAt,
  includePrivate,
}: GetPostNavigationParams): Promise<PostNavigation> => {
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (categoryError || !category) throw AppError.notFound();

  const basePrevQuery = supabase
    .from('posts')
    .select('id, title')
    .eq('category_id', category.id)
    .eq('is_published', true)
    .lt('created_at', createdAt)
    .order('created_at', { ascending: false })
    .limit(1);

  const baseNextQuery = supabase
    .from('posts')
    .select('id, title')
    .eq('category_id', category.id)
    .eq('is_published', true)
    .gt('created_at', createdAt)
    .order('created_at', { ascending: true })
    .limit(1);

  const prevQuery = includePrivate
    ? basePrevQuery
    : basePrevQuery.eq('is_private', false);

  const nextQuery = includePrivate
    ? baseNextQuery
    : baseNextQuery.eq('is_private', false);

  const [prevRes, nextRes] = await Promise.all([
    prevQuery.maybeSingle(),
    nextQuery.maybeSingle(),
  ]);

  return {
    prevPost: prevRes.data || null,
    nextPost: nextRes.data || null,
  };
};

export const mapPostItemResponse = (row: PostItemRow): PostItem => ({
  id: row.id,
  title: row.title,
  summary: row.summary,
  tags: row.tags || [],
  thumbnailUrl: row.thumbnail_url,
  isPrivate: row.is_private,
  isPublished: row.is_published,
  createdAt: row.created_at,
});

export const mapPostDetailResponse = (row: PublishedPostRow): Post => {
  const category = Array.isArray(row.category) ? row.category[0] : row.category;
  return {
    ...mapPostItemResponse(row),
    content: row.content,
    updatedAt: row.updated_at || row.created_at,
    category: {
      slug: (category.slug as CategorySlug) || 'dev', // TODO
      name: category.name,
    },
  };
};

export const mapEditorPostResponse = (row: PostRow): EditorPost => {
  const draft = row.draft_data;
  const category = Array.isArray(row.category) ? row.category[0] : row.category;

  return {
    id: row.id,
    title: draft?.title ?? row.title,
    content: draft?.content ?? row.content,
    summary: draft?.summary ?? row.summary,
    category: {
      slug: category.slug as CategorySlug,
      name: category.name,
    },
    tags: draft?.tags ?? row.tags ?? [],
    thumbnailUrl: draft?.thumbnailUrl ?? row.thumbnail_url,
    isPrivate: draft?.isPrivate ?? row.is_private,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};
