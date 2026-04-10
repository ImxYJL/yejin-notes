import { PostForm } from '@/types/blog';
import { INITIAL_POST } from '@/constants/blog';
import { getAdminPost } from '@/services/postService';
import { EditorContainer } from '../components';
import { convertToPostForm } from '@/utils/posts';

type EditPageParams = {
  id: string;
};

const EditPage = async ({ params }: { params: Promise<EditPageParams> }) => {
  const { id } = await params;
  const data = await getAdminPost(id).catch(() => null);

  const initialPost: PostForm = {
    ...INITIAL_POST,
    id: crypto.randomUUID(),
  };

  const post: PostForm = data ? convertToPostForm(data) : initialPost;

  return <EditorContainer post={post} />;
};

export default EditPage;
