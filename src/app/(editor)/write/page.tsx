import EditorForm from "@/components/editor/EditorForm";
import { INITIAL_POST } from "@/constants/blog";

const WritePage = async () => {
  const initialData = {
    ...INITIAL_POST,
    id: crypto.randomUUID(),
  };

  return <EditorForm initialData={initialData} mode="create" />;
};

export default WritePage;
