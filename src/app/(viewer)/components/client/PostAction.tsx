'use client';

import { Button } from '@/components/common';
import { getButtonStyles } from '@/components/common/Button';
import { PAGE_PATH } from '@/constants/paths';
import { CategorySlug } from '@/types/blog';
import { Edit2, Trash } from 'lucide-react';
import Link from 'next/link';
import useDeletePost from '@/queries/useDeletePost';
import useIsAdmin from '@/queries/auth/useIsAdmin';

type Props = {
  categorySlug: CategorySlug;
  id: string;
};

const PostAction = ({ id, categorySlug }: Props) => {
  const { isAdmin } = useIsAdmin();
  const { mutate: deletePost, isPending } = useDeletePost();

  const handleDelete = () => {
    if (isPending) return;

    if (window.confirm('정말 삭제하시겠습니까?')) {
      deletePost({ id, categorySlug });
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        <Link
          href={PAGE_PATH.admin.edit(id)}
          className={getButtonStyles('ghost', 'sm', 'p-1')}
        >
          <Edit2 size={18} />
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="p-1 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
        >
          <Trash size={18} />
        </Button>
      </div>
    </div>
  );
};

export default PostAction;
