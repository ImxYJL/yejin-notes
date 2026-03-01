import { CategorySlug } from "@/types/blog";
import { PostListContainer } from "../../components";

type PostListPageParams = {
  categorySlug: CategorySlug;
};

const PostListPage = async ({
  params,
}: {
  params: Promise<PostListPageParams>;
}) => {
  const { categorySlug } = await params;

  return <PostListContainer categorySlug={categorySlug} />;
};

export default PostListPage;
