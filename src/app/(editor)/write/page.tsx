import EditorForm from "@/components/editor/EditorForm";
import { INITIAL_POST } from "@/constants/blog";

// TODO: Write와 Edit 합치기
const WritePage = async () => {
  const initialData = {
    ...INITIAL_POST,
    id: crypto.randomUUID(),
  };

  return <EditorForm initialData={initialData} mode="create" />;
};

export default WritePage;
