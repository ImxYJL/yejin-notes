"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/libs/tanstack/queryClient";
import { useState } from "react";

let browserQueryClient: QueryClient | undefined = undefined;

const getBrowserQueryClient = () => {
  // 브라우저에서는 전역 싱글턴 객체로 사용
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
};

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => getBrowserQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
