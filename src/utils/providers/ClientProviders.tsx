"use client";

import QueryErrorProvider from "./QueryErrorProvider";
import QueryProvider from "./QueryProvider";

type ClientProvidersProps = {
  children: React.ReactNode;
};

const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <QueryProvider>
      <QueryErrorProvider>{children}</QueryErrorProvider>
    </QueryProvider>
  );
};

export default ClientProviders;
