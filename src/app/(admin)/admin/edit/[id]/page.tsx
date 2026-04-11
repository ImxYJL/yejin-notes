import { PostForm } from '@/types/blog';
import { getAdminPost } from '@/services/postService';
import { EditorContainer } from '../components';
import { convertToPostForm } from '@/utils/posts';
import { AppError } from '@/utils/error';

type EditPageParams = {
  id: string;
};

const EditPage = async ({ params }: { params: Promise<EditPageParams> }) => {
  const { id } = await params;
  if (!id) AppError.notFound();

  const data = await getAdminPost(id).catch(() => null);
  if (!data) AppError.notFound();

  const post: PostForm = convertToPostForm(data!);
  return <EditorContainer post={post} />;
};

export default EditPage;
