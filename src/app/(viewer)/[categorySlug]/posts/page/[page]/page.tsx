import {
  getPublicCategories,
  getPublicCategoryBySlug,
} from '@/services/categoryService';
import { getPublicPosts } from '@/services/postService';
import { PAGE_LIMIT } from '@/constants/blog';
import { getValidatedPage, START_PAGE_NUM, validatePageBounds } from '@/utils/page';
import { PAGE_PATH } from '@/constants/paths';
import { PostListLayout } from '../../../../components/server';
import { buildCategoryMap } from '@/utils/posts/category';
import { AppError } from '@/utils/error';
import { CategorySlug } from '@/types/blog';
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
  const categories = await getPublicCategories();

  const results = await Promise.all(
    categories.map(async (c) => {
      const { totalPages } = await getPublicPosts(c.slug, 1, PAGE_LIMIT);
      return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
        categorySlug: c.slug,
        page: String(i + 2),
      }));
    }),
  );

  return results.flat();
}

const PostListPage = async ({
  params,
}: {
  params: Promise<{ categorySlug: string; page: string }>;
}) => {
  const { categorySlug: rawCategorySlug, page: rawPage } = await params;

  const page = getValidatedPage(rawPage);

  // /posts/page/1 은 /posts 로 정규화
  if (page <= START_PAGE_NUM) {
    redirect(PAGE_PATH.posts(rawCategorySlug as CategorySlug));
  }

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
    getPagePath: (p) => PAGE_PATH.posts(category.slug, p),
  });

  return (
    <PostListLayout
      categoryName={categoryMap[category.slug]?.name ?? ''}
      postCount={postsRes.posts.length}
      postItems={postsRes.posts}
      currentPage={page}
      totalPages={postsRes.totalPages}
      getPostHref={(post) => PAGE_PATH.postDetail(category.slug, post.id)}
      getPageHref={(nextPage) => PAGE_PATH.posts(category.slug, nextPage)}
    />
  );
};

export default PostListPage;
