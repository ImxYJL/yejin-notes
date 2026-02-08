"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, Edit3, ArrowLeft } from "lucide-react";
import Button from "@/components/common/Button";
import { cn } from "@/utils/styles";

type EditorFormProps = {
  initialData?: {
    title: string;
    content: string;
    category: string;
    isPublished: boolean;
  };
  mode: "create" | "edit"; // mode 추가
  postId: string; // 클라이언트 발급 UUID
};

const EditorForm = ({ initialData, mode, postId }: EditorFormProps) => {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState(
    initialData ?? {
      title: "",
      content: "",
      category: "dev",
      isPublished: false,
    },
  );
  const isEdit = mode === "edit";

  const handleSave = async () => {
    // 1. 여기서 content의 앞부분을 잘라 summary를 만듭니다.
    const summary = formData.content.slice(0, 150).replace(/[#*`]/g, "");

    // 2. Supabase Upsert 로직 (postId를 PK로 사용)
    console.log("Saving...", { ...formData, id: postId, summary });
    // 성공 후 상세 페이지로 이동
    // router.push(`/${formData.category}/posts/${postId}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {isEdit ? "Edit Post" : "New Post"}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            icon={isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
          >
            {isPreview ? "Write" : "Preview"}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            icon={<Save size={16} />}
          >
            {isEdit ? "Update" : "Publish"}
          </Button>
        </div>
      </header>

      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[70vh]">
        <input
          className="p-8 text-4xl font-bold outline-none border-b border-gray-50"
          placeholder="Enter title..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="flex-1">
          {!isPreview ? (
            <textarea
              className="w-full h-full p-8 outline-none resize-none font-mono text-base leading-relaxed"
              placeholder="Write your story in markdown..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
          ) : (
            <div className="markdown-body p-8">
              <h1>{formData.title}</h1>
              {/* Markdown Parser 컴포넌트 위치 */}
              <p>{formData.content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorForm;
