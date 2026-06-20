import {
  getPublicCategories,
  getPublicCategoryBySlug,
} from '@/services/categoryService';
import { getPublicPosts } from '@/services/postService';
import { PAGE_LIMIT } from '@/constants/blog';
import { START_PAGE_NUM, validatePageBounds } from '@/utils/page';
import { PAGE_PATH } from '@/constants/paths';
import { PostListLayout } from '../../components/server';
import { buildCategoryMap } from '@/utils/posts/category';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const categories = await getPublicCategories();

  return categories.map((c) => ({
    categorySlug: c.slug,
  }));
}

const PostListPage = async ({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) => {
  const { categorySlug: rawCategorySlug } = await params;

  const category = await getPublicCategoryBySlug(rawCategorySlug).catch(() => notFound());

  const [categories, postsRes] = await Promise.all([
    getPublicCategories(),
    getPublicPosts(category.slug, START_PAGE_NUM, PAGE_LIMIT),
  ]);
  const categoryMap = buildCategoryMap(categories);

  validatePageBounds({
    postsLength: postsRes.posts.length,
    totalPages: postsRes.totalPages,
    currentPage: START_PAGE_NUM,
    getPagePath: (page) => PAGE_PATH.posts(category.slug, page),
  });

  return (
    <PostListLayout
      categoryName={categoryMap[category.slug]?.name ?? ''}
      postCount={postsRes.posts.length}
      postItems={postsRes.posts}
      currentPage={START_PAGE_NUM}
      totalPages={postsRes.totalPages}
      getPostHref={(post) => PAGE_PATH.postDetail(category.slug, post.id)}
      getPageHref={(nextPage) => PAGE_PATH.posts(category.slug, nextPage)}
    />
  );
};

export default PostListPage;
