import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        throwOnError: true,
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000, // for SSR
      },
      mutations: {
        retry: 1,
        throwOnError: true,
      },
    },
  });
}
