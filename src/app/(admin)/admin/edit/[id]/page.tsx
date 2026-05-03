import { PostForm } from '@/types/blog';
import { getAdminPost } from '@/services/postService';
import { EditorContainer } from '../components';
import { convertToPostForm } from '@/utils/posts';
import { AppError } from '@/utils/error';
import { getAllCategories } from '@/services/categoryService';

type EditPageParams = {
  id: string;
};

const EditPage = async ({ params }: { params: Promise<EditPageParams> }) => {
  const { id } = await params;
  if (!id) AppError.notFound();

  const data = await getAdminPost(id).catch(() => null);
  if (!data) AppError.notFound();

  const post: PostForm = convertToPostForm(data!);
  const categories = await getAllCategories();

  return <EditorContainer post={post} categories={categories} />;
};

export default EditPage;
