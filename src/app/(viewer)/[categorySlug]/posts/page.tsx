import { CategorySlug } from '@/types/blog';
import { getPublicCategories } from '@/services/categoryService';
import { getPublicPosts } from '@/services/postService';
import { PAGE_LIMIT } from '@/constants/blog';
import { getValidatedPage, validatePageBounds } from '@/utils/page';
import { PAGE_PATH } from '@/constants/paths';
import { createUrl } from '@/utils/url';
import { PostListLayout } from '../../components/server';
import { buildCategoryMap } from '@/utils/posts/category';

export async function generateStaticParams() {
  const categories = await getPublicCategories();

  return categories.map((c) => ({
    categorySlug: c.slug,
  }));
}

const PostListPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: CategorySlug }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const [{ categorySlug }, { page: rawPage }] = await Promise.all([
    params,
    searchParams,
  ]);
  const page = getValidatedPage(rawPage);

  const [categories, postsRes] = await Promise.all([
    getPublicCategories(),
    getPublicPosts(categorySlug, page, PAGE_LIMIT),
  ]);
  const categoryMap = buildCategoryMap(categories);
  const categoryName = categoryMap[categorySlug]?.name ?? '';

  validatePageBounds({
    postsLength: postsRes.posts.length,
    totalPages: postsRes.totalPages,
    currentPage: page,
    basePath: PAGE_PATH.posts(categorySlug),
  });

  return (
    <PostListLayout
      categoryName={categoryName}
      postCount={postsRes.posts.length}
      postItems={postsRes.posts}
      currentPage={page}
      totalPages={postsRes.totalPages}
      getPostHref={(post) => PAGE_PATH.postDetail(categorySlug, post.id)}
      getPageHref={(nextPage) =>
        createUrl(PAGE_PATH.posts(categorySlug), {
          page: nextPage,
        })
      }
    />
  );
};

export default PostListPage;
