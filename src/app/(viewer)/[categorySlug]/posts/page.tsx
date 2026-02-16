import { CategorySlug } from "@/types/blog";
import { PostList } from "../../components";

type PostListPageParams = {
  categorySlug: CategorySlug;
};

const PostListPage = async ({
  params,
}: {
  params: Promise<PostListPageParams>;
}) => {
  const { categorySlug } = await params;

  return <PostList categorySlug={categorySlug} />;
};

export default PostListPage;
