import 'server-only';

import { createServerSupabaseClient } from '@/libs/supabase/server';
import { AppError } from '@/utils/error';
import {
  getAllCategories,
  getPublicCategories,
  validateCategoryAccess,
} from './categoryService';
import { validateAdmin } from './authService';
import {
  CategorySlug,
  DraftPost,
  Post,
  PostDetailResponse,
  PostForm,
  PostItem,
  PostRow,
} from '@/types/blog';
import { publicSupabase } from '@/libs/supabase/client';
import { revalidateTag, unstable_cache } from 'next/cache';
import { NEXT_CACHE_KEY, NEXT_CACHE_TAG } from '@/constants/blog';

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
    async (postId: string): Promise<PostDetailResponse> => {
      // RLS가 비공개 글/카테고리 차단 → error or null 반환
      const { data: currentPost, error } = await publicSupabase
        .from('posts')
        .select('*, category:categories(slug, name)')
        .eq('id', postId)
        .single();

      if (error || !currentPost) throw AppError.notFound();

      const [prevRes, nextRes] = await Promise.all([
        publicSupabase
          .from('posts')
          .select('id, title')
          .eq('category_id', currentPost.category_id)
          .eq('is_published', true)
          .eq('is_private', false)
          .lt('created_at', currentPost.created_at)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        publicSupabase
          .from('posts')
          .select('id, title')
          .eq('category_id', currentPost.category_id)
          .eq('is_published', true)
          .eq('is_private', false)
          .gt('created_at', currentPost.created_at)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle(),
      ]);

      return {
        ...mapPostDetailResponse(currentPost),
        prevPost: prevRes.data || null,
        nextPost: nextRes.data || null,
      };
    },
    [NEXT_CACHE_KEY.post(postId)],
    {
      tags: [NEXT_CACHE_TAG.post(postId), NEXT_CACHE_TAG.posts],
    },
  )(postId);

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

  const supabase = await createServerSupabaseClient();
  const categories = await getAllCategories();
  // 관리자는 비공개 카테고리도 접근 가능하므로 user 넘김
  validateCategoryAccess(categorySlug, categories, { isAdmin: true, id: '' });

  const LIMIT = Math.min(limit || DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT);
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

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

export const getAdminPost = async (postId: string): Promise<PostDetailResponse> => {
  await validateAdmin();

  const supabase = await createServerSupabaseClient();

  const { data: currentPost, error } = await supabase
    .from('posts')
    .select('*, category:categories(slug, name)')
    .eq('id', postId)
    .single();

  if (error || !currentPost) throw AppError.notFound();

  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from('posts')
      .select('id, title')
      .eq('category_id', currentPost.category_id)
      .eq('is_published', true)
      .lt('created_at', currentPost.created_at)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('posts')
      .select('id, title')
      .eq('category_id', currentPost.category_id)
      .eq('is_published', true)
      .gt('created_at', currentPost.created_at)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    ...mapPostDetailResponse(currentPost),
    prevPost: prevRes.data || null,
    nextPost: nextRes.data || null,
  };
};

export const upsertPost = async (formData: PostForm): Promise<Post> => {
  const supabase = await createServerSupabaseClient();

  const [user, categoryId] = await Promise.all([
    validateAdmin(),
    getCategoryIdBySlug(formData.categorySlug),
  ]);

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

  revalidateTag(NEXT_CACHE_TAG.post(formData.id));
  revalidateTag(NEXT_CACHE_TAG.categoryPosts(formData.categorySlug));
  revalidateTag(NEXT_CACHE_TAG.posts);

  return mapPostDetailResponse(data);
};

export const deletePost = async (id: string, categorySlug: CategorySlug) => {
  await validateAdmin();
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw AppError.fromSupabase(error);

  revalidateTag(NEXT_CACHE_TAG.post(id));
  revalidateTag(NEXT_CACHE_TAG.categoryPosts(categorySlug));
  revalidateTag(NEXT_CACHE_TAG.posts);
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
