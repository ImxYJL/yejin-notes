export type Category = {
  id: string; // 'dev', 'reading', 'life'
  name: string; // '개발', '독서', '일상'
  isPrivate: boolean;
  userId: string;
};
export type CategoryType = "dev" | "reading" | "life";

export type EditorMode = "create" | "edit";

export type Post = {
  id: string;
  createdAt: string;
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  tags: string[];
  userId: string;
  isPublished: boolean;
  isPrivate: boolean;
  thumbnailUrl: string | null;
};

export type PostFormData = Pick<
  Post,
  | "id"
  | "title"
  | "content"
  | "summary"
  | "categoryId"
  | "tags"
  | "isPublished"
  | "isPrivate"
  | "thumbnailUrl"
>;
