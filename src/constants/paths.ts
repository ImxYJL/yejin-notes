import { CategorySlug } from '@/types/blog';
import { QUERY_PARAMS } from './system';
import { START_PAGE_NUM } from '@/utils/page';

const ADMIN_PREFIX = '/admin';

export const PAGE_PATH = {
  home: '/',
  login: '/login',

  // public
  posts: (slug: CategorySlug, page: number = START_PAGE_NUM) =>
    page <= START_PAGE_NUM ? `/${slug}/posts` : `/${slug}/posts/page/${page}`,
  postDetail: (slug: CategorySlug, postId: string) => `/${slug}/posts/${postId}`,

  // admin
  admin: {
    write: `${ADMIN_PREFIX}/write`,
    edit: (postId: string) => `${ADMIN_PREFIX}/edit/${postId}`,
    posts: (slug: CategorySlug, page: number = START_PAGE_NUM) =>
      `${ADMIN_PREFIX}/${slug}/posts?${QUERY_PARAMS.page}=${page}`,
    postDetail: (slug: CategorySlug, postId: string) =>
      `${ADMIN_PREFIX}/${slug}/posts/${postId}`,
  },
} as const;

export const API_ENDPOINT = {
  // public
  posts: (slug: CategorySlug) => `/posts?${QUERY_PARAMS.categorySlug}=${slug}`,
  post: (id: string) => `/posts/${id}`,

  // admin
  admin: {
    posts: (slug: CategorySlug) =>
      `${ADMIN_PREFIX}/posts?${QUERY_PARAMS.categorySlug}=${slug}`,
    post: (id?: string) =>
      id ? `${ADMIN_PREFIX}/posts/${id}` : `${ADMIN_PREFIX}/posts`,
    drafts: `${ADMIN_PREFIX}/posts/drafts`,
    draft: (id: string) => `${ADMIN_PREFIX}/posts/drafts/${id}`,
  },

  me: '/auth/me',
} as const;
