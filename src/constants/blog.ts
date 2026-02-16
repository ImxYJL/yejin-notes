import { PostForm } from "@/types/blog";

export const DEFAULT_POST_FORM: PostForm = {
  id: "",
  title: "",
  content: "",
  summary: "",
  categoryId: "dev",
  tags: [],
  isPublished: true,
  isPrivate: false,
  thumbnailUrl: null,
};

export const CATEGORY_MAP = {
  dev: { name: "개발", isPrivate: false },
  reading: { name: "독서", isPrivate: false },
  life: { name: "일상", isPrivate: true },
} as const;
