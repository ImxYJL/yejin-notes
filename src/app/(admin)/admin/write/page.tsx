import EditorForm from '@/components/editor/EditorForm';
import { INITIAL_POST } from '@/constants/blog';
import { getAllCategories } from '@/services/categoryService';
import { Suspense } from 'react';

// TODO: Write와 Edit 합치기
const WritePage = async () => {
  const initialData = {
    ...INITIAL_POST,
    id: crypto.randomUUID(),
  };

  const categories = await getAllCategories();

  return (
    <Suspense>
      <EditorForm initialData={initialData} categories={categories} mode="create" />
    </Suspense>
  );
};

export default WritePage;
