import { PostFormData } from "@/types/blog";

export const DEFAULT_POST_FORM: PostFormData = {
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
