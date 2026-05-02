import { CategorySlug } from '@/types/blog';
import { getAdminPosts } from '@/services/postService';
import { PAGE_LIMIT } from '@/constants/blog';
import { getValidatedPage, validatePageBounds } from '@/utils/page';
import { PAGE_PATH } from '@/constants/paths';
import { getAllCategories } from '@/services/categoryService';
import { buildCategoryMap } from '@/utils/posts/category';
import { PostListLayout } from '@/app/(viewer)/components/server';
import { createUrl } from '@/utils/url';
import AdminPostListActions from '@/app/(viewer)/components/server/AdminPostListActions';

export default async function AdminPostListPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: CategorySlug }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ categorySlug }, { page: rawPage }] = await Promise.all([
    params,
    searchParams,
  ]);
  const page = getValidatedPage(rawPage);

  const [categories, postsRes] = await Promise.all([
    getAllCategories(),
    getAdminPosts(categorySlug, page, PAGE_LIMIT),
  ]);
  const categoryMap = buildCategoryMap(categories);
  const categoryName = categoryMap[categorySlug]?.name ?? '';

  validatePageBounds({
    postsLength: postsRes.posts.length,
    totalPages: postsRes.totalPages,
    currentPage: page,
    basePath: PAGE_PATH.admin.posts(categorySlug),
  });

  return (
    <PostListLayout
      categoryName={categoryName}
      postCount={postsRes.posts.length}
      postItems={postsRes.posts}
      currentPage={page}
      totalPages={postsRes.totalPages}
      getPostHref={(post) => PAGE_PATH.admin.postDetail(categorySlug, post.id)}
      getPageHref={(nextPage) =>
        createUrl(PAGE_PATH.admin.posts(categorySlug), {
          page: nextPage,
        })
      }
      headerActions={<AdminPostListActions />}
    />
  );
}
