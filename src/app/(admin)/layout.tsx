import { Suspense } from 'react';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  return <Suspense>{children}</Suspense>;
};

export default AdminLayout;
