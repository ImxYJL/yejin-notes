'use client';

import QueryErrorProvider from './QueryErrorProvider';
import QueryProvider from './QueryProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

type ClientProvidersProps = {
  children: React.ReactNode;
};

const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <QueryProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <QueryErrorProvider>{children}</QueryErrorProvider>
    </QueryProvider>
  );
};

export default ClientProviders;
