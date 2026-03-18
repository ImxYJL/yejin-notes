import { CategorySlug } from '@/types/blog';
import PostDetail from './PostDetail';
import { getPost } from '@/services/postService';
import { checkIsAdmin } from '@/services/authService';
import { getMarkdownComponent } from '@/utils/markdowns/style';

type Props = {
  categorySlug: CategorySlug;
  id: string;
};

const PostDetailContainer = async ({ categorySlug, id }: Props) => {
  const post = await getPost(id);
  const isAdmin = await checkIsAdmin();
  const contentNode = await getMarkdownComponent(post.content);

  return (
    <PostDetail
      categorySlug={categorySlug}
      post={post}
      contentNode={contentNode}
      isAdmin={isAdmin}
    />
  );
};

export default PostDetailContainer;
