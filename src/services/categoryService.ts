import 'server-only';

import { createServerSupabaseClient } from '@/libs/supabase/server';
import { AppError } from '@/utils/error';
import { Category } from '@/types/blog';
import { publicSupabase } from '@/libs/supabase/client';

export const getPublicCategories = async (): Promise<Category[]> => {
  const { data, error } = await publicSupabase
    .from('categories')
    .select('id, name, slug, is_private')
    .eq('is_private', false);

  if (error) throw AppError.fromSupabase(error);
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    isPrivate: row.is_private,
  }));
};

export const getAllCategories = async (): Promise<Category[]> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, is_private');

  if (error) throw AppError.fromSupabase(error);
  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    isPrivate: row.is_private,
  }));
};

export const getPublicCategoryBySlug = async (slug: string): Promise<Category> => {
  const { data, error } = await publicSupabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_private', false)
    .maybeSingle();

  if (error || !data) throw AppError.notFound(null, '존재하지 않는 카테고리입니다.');

  return data;
};

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) throw AppError.notFound(null, '존재하지 않는 카테고리입니다.');

  return data;
};
