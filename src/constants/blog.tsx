import { CategorySlug, PostForm } from "@/types/blog";
import { BookOpen, Code, Coffee } from "lucide-react";

export const CATEGORY_MAP = {
  dev: {
    icon: <Code size={20} />,
    textColor: "text-accent-primary",
  },
  reading: {
    icon: <BookOpen size={20} />,
    textColor: "text-[var(--palette-4)]",
  },
  life: {
    icon: <Coffee size={20} />,
    textColor: "text-orange-500",
  },
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
