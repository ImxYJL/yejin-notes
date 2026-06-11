import { getEditorPost } from '@/services/postService';
import { EditorContainer } from '../components';
import { convertToPostForm } from '@/utils/posts';
import { getAllCategories } from '@/services/categoryService';
import { INITIAL_POST } from '@/constants/blog';
import { EditorForm } from '@/components/editor';

type EditPageParams = {
  id?: string;
};

const EditPage = async ({ params }: { params: Promise<EditPageParams> }) => {
  const { id } = await params;
  const postId = id?.[0];

  const categories = await getAllCategories();

  if (postId) {
    const post = await getEditorPost(postId);

    return (
      <EditorContainer categories={categories} post={convertToPostForm(post)} />
    );
  }

  return (
    <EditorForm
      initialData={{
        ...INITIAL_POST,
      }}
      categories={categories}
      mode="create"
    />
  );
};

export default EditPage;
