import { CategorySlug, PostForm } from "@/types/blog";

export const CATEGORY_MAP = {
  dev: { name: "개발", isPrivate: false },
  reading: { name: "독서", isPrivate: false },
  life: { name: "일상", isPrivate: true },
} as const;

export const CATEGORY_KEYS: CategorySlug[] = ["dev", "reading", "life"];

export const INITIAL_POST: Omit<PostForm, "id"> = {
  title: "",
  content: "",
  summary: "",
  categorySlug: "dev",
  tags: [],
  thumbnailUrl: null,
  isPrivate: false,
  isPublished: false,
};
