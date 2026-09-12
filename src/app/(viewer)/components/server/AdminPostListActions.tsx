import { PAGE_PATH } from '@/constants/paths';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const AdminPostListActions = () => (
  <Link
    href={PAGE_PATH.admin.edit()}
    className="flex items-center justify-center text-accent-primary base-transition hover:opacity-70"
  >
    <Plus size={28} />
  </Link>
);

export default AdminPostListActions;
