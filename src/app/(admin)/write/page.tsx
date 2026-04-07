import EditorForm from '@/components/editor/EditorForm';
import { INITIAL_POST } from '@/constants/blog';
import { makeQueryClient } from '@/libs/tanstack/queryClient';
import { BLOG_QUERY_KEY } from '@/queries/queryKey';
import { getAllCategories } from '@/services/categoryService';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

// TODO: Write와 Edit 합치기
const WritePage = async () => {
  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [BLOG_QUERY_KEY.categories],
    queryFn: getAllCategories,
  });

  const initialData = {
    ...INITIAL_POST,
    id: crypto.randomUUID(),
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditorForm initialData={initialData} mode="create" />
    </HydrationBoundary>
  );
};

export default WritePage;
