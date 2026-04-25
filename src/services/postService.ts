import 'server-only';

import { createServerSupabaseClient } from '@/libs/supabase/server';
import { AppError } from '@/utils/error';
import {
  getAllCategories,
  getPublicCategories,
  validateCategoryAccess,
} from './categoryService';
import { getAuthUser, validateAdmin } from './authService';
import {
  CategorySlug,
  DraftPost,
  Post,
  PostDetailResponse,
  PostForm,
  PostItem,
  PostNavigation,
  PostRow,
} from '@/types/blog';
import { publicSupabase } from '@/libs/supabase/client';
import { cacheTag, revalidateTag, unstable_cache, updateTag } from 'next/cache';
import { NEXT_CACHE_KEY, NEXT_CACHE_TAG } from '@/constants/blog';
import { SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_PAGE_LIMIT = 10;
const MAX_PAGE_LIMIT = 50;

// ----------------------------------------------------------------
// Public (anon, SSG 가능)
// RLS: is_published = true AND is_private = false AND 카테고리도 공개
// ----------------------------------------------------------------
export const getPublicPosts = async (
  categorySlug: CategorySlug,
  page: number = 1,
  limit?: number,
) => {
  'use cache';
  cacheTag(NEXT_CACHE_TAG.posts, NEXT_CACHE_TAG.categoryPosts(categorySlug));

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
};

export const getPublicPost = async (postId: string): Promise<Post> => {
  'use cache';
  cacheTag(NEXT_CACHE_TAG.post(postId));

  const { data: currentPost, error } = await publicSupabase
    .from('posts')
    .select('*, category:categories(slug, name)')
    .eq('id', postId)
    .single();

  if (error || !currentPost) throw AppError.notFound();
  return mapPostDetailResponse(currentPost);
};

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

  const { data: currentPost, error } = await supabase
    .from('posts')
    .select('*, category:categories(slug, name)')
    .eq('id', postId)
    .single();

  if (error || !currentPost) throw AppError.notFound();

  return {
    ...mapPostDetailResponse(currentPost),
  };
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

export const upsertPost = async (formData: PostForm): Promise<Post> => {
  const supabase = await createServerSupabaseClient();

  const [user, categoryId] = await Promise.all([
    validateAdmin(),
    getCategoryIdBySlug(formData.categorySlug),
  ]);

  const oldPost = await getAdminPost(formData.id).catch(() => null);
  if (oldPost) {
    await revalidateAdjacentPosts(oldPost.category.slug, oldPost.createdAt);
  }

  const { data, error } = await supabase
    .from('posts')
    .upsert(
      {
        id: formData.id,
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        category_id: categoryId,
        tags: formData.tags,
        is_private: formData.isPrivate,
        is_published: formData.isPublished,
        thumbnail_url: formData.thumbnailUrl,
        user_id: user.id,
      },
      { onConflict: 'id' },
    )
    .select('*, category:categories!inner(slug, name)')
    .single();

  if (error) throw AppError.fromSupabase(error);
  if (!data) throw AppError.internal('데이터 처리에 실패했습니다.');

  updateTag(NEXT_CACHE_TAG.post(formData.id));
  updateTag(NEXT_CACHE_TAG.categoryPosts(formData.categorySlug));
  updateTag(NEXT_CACHE_TAG.posts);

  const newPost = mapPostDetailResponse(data);
  await revalidateAdjacentPosts(newPost.category.slug, newPost.createdAt);

  return mapPostDetailResponse(data);
};

export const deletePost = async (id: string, categorySlug: CategorySlug) => {
  await validateAdmin();
  const supabase = await createServerSupabaseClient();

  const targetPost = await getAdminPost(id);
  await revalidateAdjacentPosts(categorySlug, targetPost.createdAt);

  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw AppError.fromSupabase(error);

  updateTag(NEXT_CACHE_TAG.post(id));
  updateTag(NEXT_CACHE_TAG.categoryPosts(categorySlug));
  updateTag(NEXT_CACHE_TAG.posts);
};

export const getDrafts = async (): Promise<DraftPost[]> => {
  await validateAdmin();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, createdAt:created_at')
    .eq('is_published', false)
    .order('created_at', { ascending: false });

  if (error) throw AppError.fromSupabase(error);
  return (data as DraftPost[]) || [];
};

// ----------------------------------------------------------------
// 공통 유틸
// ----------------------------------------------------------------

export const getCategoryIdBySlug = async (slug: string) => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single();

  if (error || !data) throw AppError.notFound(null, '존재하지 않는 카테고리입니다.');
  return data.id;
};

const revalidateAdjacentPosts = async (
  categorySlug: CategorySlug,
  createdAt: string,
) => {
  const navigation = await getAdminPostNavigation(categorySlug, createdAt);
  if (navigation.prevPost) {
    updateTag(NEXT_CACHE_TAG.post(navigation.prevPost.id));
  }
  if (navigation.nextPost) {
    updateTag(NEXT_CACHE_TAG.post(navigation.nextPost.id));
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

export const mapPostItemResponse = (
  row: Omit<PostRow, 'content' | 'category'>,
): PostItem => ({
  id: row.id,
  title: row.title,
  summary: row.summary,
  tags: row.tags || [],
  thumbnailUrl: row.thumbnail_url,
  isPrivate: row.is_private,
  isPublished: row.is_published,
  createdAt: row.created_at,
});

export const mapPostDetailResponse = (row: PostRow): Post => ({
  ...mapPostItemResponse(row),
  content: row.content,
  updatedAt: row.updated_at || row.created_at,
  category: {
    slug: (row.category.slug as CategorySlug) || 'dev', // TODO
    name: row.category.name,
  },
});
