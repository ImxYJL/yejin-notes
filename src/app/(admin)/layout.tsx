import { validateAdmin } from '@/services/authService';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await validateAdmin(); // 관리자 아니면 redirect or throw

  return <>{children}</>;
};

export default AdminLayout;
