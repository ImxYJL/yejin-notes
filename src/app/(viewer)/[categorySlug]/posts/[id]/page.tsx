import { PostDetail, PostDetailSkeleton } from "@/app/(viewer)/components";
import { checkIsAdmin } from "@/services/authService";
import { getPost } from "@/services/postService";
import { CategorySlug } from "@/types/blog";
import { getMarkdownHtml } from "@/utils/markdown";
import { Suspense } from "react";

type PostDetailPageParams = {
  categorySlug: CategorySlug;
  id: string;
};

const PostDetailPage = async ({
  params,
}: {
  params: Promise<PostDetailPageParams>;
}) => {
  const { categorySlug, id } = await params;

  // TODO: await 분리
  const post = await getPost(id);
  const isAdmin = await checkIsAdmin();

  const htmlContent = await getMarkdownHtml(post.content);

  return (
    <Suspense fallback={<PostDetailSkeleton />}>
      <PostDetail
        categorySlug={categorySlug}
        post={post}
        htmlContent={htmlContent}
        isAdmin={isAdmin}
      />
    </Suspense>
  );
};

export default PostDetailPage;
