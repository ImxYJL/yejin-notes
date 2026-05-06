import {
  getPublicCategories,
  getPublicCategoryBySlug,
} from '@/services/categoryService';
import { getPublicPosts } from '@/services/postService';
import { PAGE_LIMIT } from '@/constants/blog';
import { getValidatedPage, validatePageBounds } from '@/utils/page';
import { PAGE_PATH } from '@/constants/paths';
import { createUrl } from '@/utils/url';
import { PostListLayout } from '../../components/server';
import { buildCategoryMap } from '@/utils/posts/category';
import { AppError } from '@/utils/error';

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
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const [{ categorySlug: rawCategorySlug }, { page: rawPage }] = await Promise.all([
    params,
    searchParams,
  ]);
  const page = getValidatedPage(rawPage);

  const category = await getPublicCategoryBySlug(rawCategorySlug);
  if (!category) throw AppError.notFound();

  const [categories, postsRes] = await Promise.all([
    getPublicCategories(),
    getPublicPosts(category.slug, page, PAGE_LIMIT),
  ]);
  const categoryMap = buildCategoryMap(categories);

  validatePageBounds({
    postsLength: postsRes.posts.length,
    totalPages: postsRes.totalPages,
    currentPage: page,
    basePath: PAGE_PATH.posts(category.slug),
  });

  return (
    <PostListLayout
      categoryName={categoryMap[category.slug]?.name ?? ''}
      postCount={postsRes.posts.length}
      postItems={postsRes.posts}
      currentPage={page}
      totalPages={postsRes.totalPages}
      getPostHref={(post) => PAGE_PATH.postDetail(category.slug, post.id)}
      getPageHref={(nextPage) =>
        createUrl(PAGE_PATH.posts(category.slug), {
          page: nextPage,
        })
      }
    />
  );
};

export default PostListPage;
