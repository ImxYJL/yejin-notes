import { PostForm } from '@/types/blog';
import EditorForm from '@/components/editor/EditorForm';

type props = {
  post: PostForm;
};

const EditorContainer = async ({ post }: props) => (
  <EditorForm
    mode="edit"
    initialData={{
      id: post.id,
      title: post.title,
      content: post.content,
      categorySlug: post.categorySlug,
      isPrivate: post.isPrivate,
      isPublished: post.isPublished,
      summary: post.summary,
      tags: post.tags,
      thumbnailUrl: post.thumbnailUrl,
    }}
  />
);

export default EditorContainer;
