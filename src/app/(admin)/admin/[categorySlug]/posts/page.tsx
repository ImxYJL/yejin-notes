import { getAdminPosts } from '@/services/postService';
import { PAGE_LIMIT } from '@/constants/blog';
import { getValidatedPage, validatePageBounds } from '@/utils/page';
import { PAGE_PATH } from '@/constants/paths';
import { getAllCategories, getCategoryBySlug } from '@/services/categoryService';
import { buildCategoryMap } from '@/utils/posts/category';
import { PostListLayout } from '@/app/(viewer)/components/server';
import { createUrl } from '@/utils/url';
import AdminPostListActions from '@/app/(viewer)/components/server/AdminPostListActions';
import { AppError } from '@/utils/error';

export default async function AdminPostListPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ categorySlug: rawCategorySlug }, { page: rawPage }] = await Promise.all([
    params,
    searchParams,
  ]);
  const page = getValidatedPage(rawPage);

  const category = await getCategoryBySlug(rawCategorySlug);
  if (!category) throw AppError.notFound();

  const [categories, postsRes] = await Promise.all([
    getAllCategories(),
    getAdminPosts(category.slug, page, PAGE_LIMIT),
  ]);
  const categoryMap = buildCategoryMap(categories);

  validatePageBounds({
    postsLength: postsRes.posts.length,
    totalPages: postsRes.totalPages,
    currentPage: page,
    getPagePath: (page) => createUrl(PAGE_PATH.admin.posts(category.slug), { page }),
  });

  return (
    <PostListLayout
      categoryName={categoryMap[category.slug]?.name ?? ''}
      postCount={postsRes.posts.length}
      postItems={postsRes.posts}
      currentPage={page}
      totalPages={postsRes.totalPages}
      getPostHref={(post) => PAGE_PATH.admin.postDetail(category.slug, post.id)}
      getPageHref={(nextPage) =>
        createUrl(PAGE_PATH.admin.posts(category.slug), {
          page: nextPage,
        })
      }
      headerActions={<AdminPostListActions />}
    />
  );
}
