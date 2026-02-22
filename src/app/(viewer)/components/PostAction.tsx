"use client";

import { Button } from "@/components/common";
import { getButtonStyles } from "@/components/common/Button";
import { PAGE_PATH } from "@/constants/paths";
import { CategorySlug } from "@/types/blog";
import { Edit2, Trash } from "lucide-react";
import Link from "next/link";
import useDeletePost from "@/queries/useDeletePost";

type Props = {
  categorySlug: CategorySlug;
  id: string;
};

const PostAction = ({ id, categorySlug }: Props) => {
  const { mutate: deletePost, isPending } = useDeletePost(categorySlug);

  const handleDelete = () => {
    if (isPending) return;

    if (window.confirm("정말 삭제하시겠습니까?")) {
      deletePost(id);
    }
  };

  return (
    <div className="flex gap-1">
      <Link
        href={PAGE_PATH.edit(id)}
        className={getButtonStyles("ghost", "sm", "p-1")}
      >
        <Edit2 size={20} />
      </Link>

      <Button variant="ghost" size="sm" className="p-1" onClick={handleDelete}>
        <Trash size={20} />
      </Button>
    </div>
  );
};

export default PostAction;
