import { CategorySlug } from '@/types/blog';

const ADMIN_PREFIX = '/admin';

export const PAGE_PATH = {
  home: '/',
  login: '/login',

  // public
  posts: (slug: CategorySlug) => `/${slug}/posts`,
  postDetail: (slug: CategorySlug, postId: string) => `/${slug}/posts/${postId}`,

  // admin
  admin: {
    write: `${ADMIN_PREFIX}/write`,
    edit: (postId: string) => `${ADMIN_PREFIX}/edit/${postId}`,
    posts: (slug: CategorySlug) => `${ADMIN_PREFIX}/${slug}/posts`,
    postDetail: (slug: CategorySlug, postId: string) =>
      `${ADMIN_PREFIX}/${slug}/posts/${postId}`,
  },
} as const;

export const API_ENDPOINT = {
  // public
  categories: '/categories',
  posts: (slug: CategorySlug) => `/posts?categorySlug=${slug}`,
  post: (id: string) => `/posts/${id}`,

  // admin
  admin: {
    posts: (slug: CategorySlug) => `/admin/posts?categorySlug=${slug}`,
    post: (id: string) => `/admin/posts/${id}`,
    drafts: '/admin/posts/drafts',
  },

  me: '/auth/me',
} as const;
