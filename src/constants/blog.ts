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
