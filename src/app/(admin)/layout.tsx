import { validateAdmin } from '@/services/authService';

export const dynamic = 'force-dynamic';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await validateAdmin();

  return <>{children}</>;
};

export default AdminLayout;
