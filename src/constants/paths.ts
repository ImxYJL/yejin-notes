import { CategorySlug } from "@/types/blog";

const ADMIN_BASE = {
  WRITE: "/write",
  EDIT: "/edit",
} as const;

export const PAGE_PATH = {
  home: "/",
  login: "/login",

  write: ADMIN_BASE.WRITE,
  edit: (postId: string) => `${ADMIN_BASE.EDIT}/${postId}`,

  posts: (slug: CategorySlug) => `/${slug}/posts`,
  postDetail: (slug: CategorySlug, postId: string) =>
    `/${slug}/posts/${postId}`,

  adminOnly: Object.values(ADMIN_BASE),
} as const;

export const API_ENDPOINT = {
  posts: "/posts",
  drafts: "/posts/drafts",
  post: (id: string) => `/posts/${id}`,
  categoryPosts: (categorySlug: CategorySlug) =>
    `/posts?category=${categorySlug}`,
  me: "/auth/me",
  categories: "/categories",
} as const;
