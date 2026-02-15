import { CategorySlug } from "@/types/blog";

export const PAGE_PATH = {
  home: "/",
  login: "/login",
  write: "/write",
  edit: (postId: string) => `/edit/${postId}`,
  posts: (slug: CategorySlug) => `/${slug}/posts`,
  postDetail: (slug: CategorySlug, postId: string) =>
    `/${slug}/posts/${postId}`,

  adminOnly: ["/write", "/edit"],
} as const;

export const API_ENDPOINT = {
  posts: (postId?: string) => (postId ? `/posts/${postId}` : "/posts"),
  me: "/auth/me",
  categories: "/categories",
} as const;
