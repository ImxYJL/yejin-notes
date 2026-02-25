import { PostDetailResponse, PostForm } from "@/types/blog";
import EditorContainer from "../components/EditorContainer";
import { INITIAL_POST } from "@/constants/blog";
import { getPost } from "@/services/postService";

type EditPageParams = {
  id: string;
};

const EditPage = async ({ params }: { params: Promise<EditPageParams> }) => {
  const { id } = await params;
  const data = await getPost(id).catch(() => null);

  const initialPost: PostForm = {
    ...INITIAL_POST,
    id: crypto.randomUUID(),
  };

  const post: PostForm = data ? convertToPostForm(data) : initialPost;

  return <EditorContainer post={post} />;
};

export default EditPage;

/**
 * 서버 응답 데이터를 폼 전용 타입으로 변환해주는 매퍼
 */
export const convertToPostForm = (data: PostDetailResponse): PostForm => {
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    summary: data.summary,
    categorySlug: data.category.slug,
    tags: data.tags,
    thumbnailUrl: data.thumbnailUrl,
    isPrivate: data.isPrivate,
    isPublished: data.isPublished,
  };
};
