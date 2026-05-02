import { getButtonStyles } from '@/components/common/Button';
import { PAGE_PATH } from '@/constants/paths';
import { Plus } from 'lucide-react';
import Link from 'next/link';

const AdminPostListActions = () => (
  <Link
    href={PAGE_PATH.admin.write}
    className={getButtonStyles('primary', 'md', 'font-bold')}
  >
    <Plus size={24} />
  </Link>
);

export default AdminPostListActions;
